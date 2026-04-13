import { body, param, query } from 'express-validator';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import SavedRecipe from '../models/SavedRecipe.js';
import Review from '../models/Review.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const recipeCardPopulate = [
  { path: 'category', select: 'name slug' },
  { path: 'chef', select: 'name' },
];

export const updateProfileValidators = [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('avatarUrl').optional().isString(),
];

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, avatarUrl } = req.body;
  if (email && email !== req.user.email) {
    const taken = await User.findOne({ email });
    if (taken) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }
    req.user.email = email;
  }
  if (name) req.user.name = name;
  if (avatarUrl !== undefined) req.user.avatarUrl = avatarUrl;
  await req.user.save();
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatarUrl: req.user.avatarUrl,
    },
  });
});

export const updatePasswordValidators = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
];

export const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  const { currentPassword, newPassword } = req.body;
  if (!(await user.comparePassword(currentPassword))) {
    res.status(400).json({ message: 'Current password incorrect' });
    return;
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated' });
});

export const dashboardStats = asyncHandler(async (req, res) => {
  const uid = req.user._id;
  const [favorites, cookLater, reviewsGiven, viewed] = await Promise.all([
    SavedRecipe.countDocuments({ user: uid, kind: 'favorite' }),
    SavedRecipe.countDocuments({ user: uid, kind: 'cook_later' }),
    Review.countDocuments({ user: uid }),
    User.findById(uid).select('recipesViewed').lean(),
  ]);
  res.json({
    favorites,
    cookLater,
    reviewsGiven,
    recipesViewed: viewed?.recipesViewed?.length ?? 0,
  });
});

export const listSavedValidators = [
  query('kind').optional().isIn(['favorite', 'cook_later']),
];

export const listSaved = asyncHandler(async (req, res) => {
  const { kind } = req.query;
  const filter = { user: req.user._id };
  if (kind) filter.kind = kind;
  const saved = await SavedRecipe.find(filter)
    .populate({
      path: 'recipe',
      match: { status: 'approved' },
      populate: recipeCardPopulate,
    })
    .sort({ updatedAt: -1 })
    .lean();
  const recipes = saved.map((s) => s.recipe).filter(Boolean);
  res.json({ recipes });
});

export const addSavedValidators = [
  body('recipeId').isMongoId(),
  body('kind').isIn(['favorite', 'cook_later']),
];

export const addSaved = asyncHandler(async (req, res) => {
  const { recipeId, kind } = req.body;
  const recipe = await Recipe.findById(recipeId);
  if (!recipe || recipe.status !== 'approved') {
    res.status(404).json({ message: 'Recipe not found' });
    return;
  }
  await SavedRecipe.findOneAndUpdate(
    { user: req.user._id, recipe: recipeId, kind },
    { user: req.user._id, recipe: recipeId, kind },
    { upsert: true, new: true }
  );
  res.status(201).json({ message: 'Saved' });
});

export const removeSavedValidators = [
  param('recipeId').isMongoId(),
  query('kind').isIn(['favorite', 'cook_later']),
];

export const removeSaved = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;
  const { kind } = req.query;
  await SavedRecipe.deleteOne({ user: req.user._id, recipe: recipeId, kind });
  res.json({ message: 'Removed' });
});

export const recentlyViewed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('recipesViewed').lean();
  const raw = user?.recipesViewed || [];
  const ids = raw.slice(-12).reverse();
  if (!ids.length) {
    res.json({ recipes: [] });
    return;
  }
  const list = await Recipe.find({ _id: { $in: ids }, status: 'approved' })
    .populate(recipeCardPopulate)
    .lean();
  const rank = new Map(ids.map((id, i) => [String(id), i]));
  list.sort((a, b) => rank.get(String(a._id)) - rank.get(String(b._id)));
  res.json({ recipes: list });
});
