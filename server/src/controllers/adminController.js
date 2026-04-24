import { body, param, query } from 'express-validator';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';
import SavedRecipe from '../models/SavedRecipe.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const listUsersValidators = [
  query('search').optional().trim(),
  query('role').optional().isIn(['user', 'chef', 'admin']),
];

export const listUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    const rx = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }
  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .lean();
  const withCounts = await Promise.all(
    users.map(async (u) => {
      const recipesViewed = u.recipesViewed?.length ?? 0;
      return {
        ...u,
        recipesViewedCount: recipesViewed,
        recipesViewed: undefined,
      };
    })
  );
  res.json({ users: withCounts });
});

export const setUserStatusValidators = [
  param('id').isMongoId(),
  body('accountStatus').isIn(['active', 'suspended']),
];

export const setUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  if (user.role === 'admin' && req.body.accountStatus === 'suspended') {
    res.status(400).json({ message: 'Cannot suspend admin' });
    return;
  }
  user.accountStatus = req.body.accountStatus;
  await user.save();
  res.json({ user: { id: user._id, accountStatus: user.accountStatus } });
});

export const listChefsValidators = [query('search').optional().trim()];

export const listChefs = asyncHandler(async (req, res) => {
  const filter = { role: 'chef' };
  if (req.query.search) {
    const rx = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { cuisineSpecialty: rx }];
  }
  const chefs = await User.find(filter).select('-password').sort({ createdAt: -1 }).lean();
  const enriched = await Promise.all(
    chefs.map(async (c) => {
      const recipes = await Recipe.find({ chef: c._id }).select('averageRating likes').lean();
      const totalRecipes = recipes.length;
      const ratings = recipes.map((r) => r.averageRating).filter((n) => n > 0);
      const rating =
        ratings.length > 0 ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : 0;
      return { ...c, totalRecipes, rating };
    })
  );
  res.json({ chefs: enriched });
});

export const updateChefValidators = [
  param('id').isMongoId(),
  body('cuisineSpecialty').optional().trim(),
  body('accountStatus').optional().isIn(['active', 'suspended']),
];

export const updateChef = asyncHandler(async (req, res) => {
  const chef = await User.findOne({ _id: req.params.id, role: 'chef' });
  if (!chef) {
    res.status(404).json({ message: 'Chef not found' });
    return;
  }
  if (req.body.cuisineSpecialty !== undefined) chef.cuisineSpecialty = req.body.cuisineSpecialty;
  if (req.body.accountStatus) chef.accountStatus = req.body.accountStatus;
  await chef.save();
  res.json({ chef: { id: chef._id, cuisineSpecialty: chef.cuisineSpecialty, accountStatus: chef.accountStatus } });
});

export const listPendingRecipes = asyncHandler(async (_req, res) => {
  const recipes = await Recipe.find({ status: 'pending' })
    .populate([
      { path: 'chef', select: 'name email' },
      { path: 'category', select: 'name slug' },
    ])
    .sort({ createdAt: -1 })
    .lean();
  res.json({ recipes });
});

export const setRecipeStatusValidators = [
  param('id').isMongoId(),
  body('status').isIn(['approved', 'rejected', 'pending']),
  body('rejectionReason').optional().isString(),
];

export const setRecipeStatus = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404).json({ message: 'Recipe not found' });
    return;
  }
  recipe.status = req.body.status;
  recipe.rejectionReason = req.body.status === 'rejected' ? req.body.rejectionReason || '' : '';
  await recipe.save();
  const populated = await Recipe.findById(recipe._id).populate([
    { path: 'chef', select: 'name email' },
    { path: 'category', select: 'name slug' },
  ]);
  res.json({ recipe: populated });
});

export const setReviewHiddenValidators = [
  param('id').isMongoId(),
  body('hidden').isBoolean(),
];

export const setReviewHidden = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }
  review.hidden = req.body.hidden;
  await review.save();
  await recalcRecipeRatingForReview(review.recipe);
  res.json({ review });
});

export const listRecipeComments = asyncHandler(async (_req, res) => {
  const comments = await Review.find()
    .populate('user', 'name email')
    .populate({
      path: 'recipe',
      select: 'title imageUrl status',
      populate: { path: 'chef', select: 'name' },
    })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ comments });
});

export const deleteReviewValidators = [param('id').isMongoId()];

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }
  const recipeId = review.recipe;
  await review.deleteOne();
  await recalcRecipeRatingForReview(recipeId);
  res.json({ message: 'Review deleted' });
});

async function recalcRecipeRatingForReview(recipeId) {
  const stats = await Review.aggregate([
    { $match: { recipe: recipeId, hidden: false, rating: { $exists: true, $ne: null } } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const avg = stats[0]?.avg ?? 0;
  const count = stats[0]?.count ?? 0;
  await Recipe.updateOne(
    { _id: recipeId },
    { averageRating: Math.round(avg * 10) / 10, reviewCount: count }
  );
}

export const analyticsOverview = asyncHandler(async (_req, res) => {
  const [
    totalUsers,
    totalChefs,
    totalRecipes,
    approvedRecipes,
    pendingRecipes,
    totalReviews,
    totalSaved,
    likeAgg,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'chef' }),
    Recipe.countDocuments(),
    Recipe.countDocuments({ status: 'approved' }),
    Recipe.countDocuments({ status: 'pending' }),
    Review.countDocuments({ hidden: false }),
    SavedRecipe.countDocuments(),
    Recipe.aggregate([{ $project: { n: { $size: '$likes' } } }, { $group: { _id: null, total: { $sum: '$n' } } }]),
  ]);
  const totalLikes = likeAgg[0]?.total ?? 0;
  res.json({
    totalUsers,
    totalChefs,
    totalRecipes,
    approvedRecipes,
    pendingRecipes,
    totalReviews,
    totalSaved,
    totalLikes,
  });
});

export const categoryStats = asyncHandler(async (_req, res) => {
  const stats = await Recipe.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const cats = await Category.find({ _id: { $in: stats.map((s) => s._id) } })
    .select('name slug')
    .lean();
  const byId = new Map(cats.map((c) => [String(c._id), c]));
  const breakdown = stats.map((s) => ({
    category: byId.get(String(s._id)) || { name: 'Unknown' },
    count: s.count,
  }));
  res.json({ breakdown });
});
