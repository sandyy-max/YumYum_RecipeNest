import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';
import Recipe from '../models/Recipe.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { isCloudinaryConfigured, uploadImageBuffer } from '../config/cloudinary.js';

const populateRecipe = [
  { path: 'chef', select: 'name email cuisineSpecialty avatarUrl' },
  { path: 'category', select: 'name slug' },
];

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseStringArray(val) {
  if (Array.isArray(val)) return val.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof val === 'string') {
    try {
      const p = JSON.parse(val);
      if (Array.isArray(p)) return p.map(String).map((s) => s.trim()).filter(Boolean);
    } catch {
      /* fall through */
    }
    return val
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function chefIdOf(recipe) {
  const c = recipe.chef;
  if (!c) return null;
  if (typeof c === 'object' && c._id) return c._id.toString();
  return c.toString();
}

function canViewRecipe(recipe, user) {
  if (recipe.status === 'approved') return true;
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'chef' && chefIdOf(recipe) === user._id.toString()) return true;
  return false;
}

export const listRecipesValidators = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isMongoId(),
  query('chef').optional().isMongoId(),
  query('search').optional().trim(),
];

export const listRecipes = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const filter = { status: 'approved' };
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.chef) {
    filter.chef = req.query.chef;
  }
  if (req.query.search) {
    const rx = new RegExp(escapeRegex(req.query.search), 'i');
    filter.$or = [{ title: rx }, { description: rx }];
  }
  const [recipes, total] = await Promise.all([
    Recipe.find(filter)
      .populate(populateRecipe)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Recipe.countDocuments(filter),
  ]);
  res.json({
    recipes,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit) || 1,
  });
});

export const getRecipeValidators = [param('id').isMongoId()];

export const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate(populateRecipe).lean();
  if (!recipe) {
    res.status(404).json({ message: 'Recipe not found' });
    return;
  }
  const user = req.user;
  const populatedChef = recipe.chef;
  if (!canViewRecipe(recipe, user)) {
    res.status(404).json({ message: 'Recipe not found' });
    return;
  }
  if (recipe.status === 'approved') {
    await Recipe.updateOne({ _id: recipe._id }, { $inc: { viewCount: 1 } });
    recipe.viewCount += 1;
  }
  if (user && user.role === 'user' && recipe.status === 'approved') {
    await mongoose.model('User').updateOne(
      { _id: user._id },
      { $addToSet: { recipesViewed: recipe._id } }
    );
  }
  res.json({ recipe: { ...recipe, chef: populatedChef } });
});

export const createRecipeValidators = [
  body('title').trim().notEmpty(),
  body('description').optional().isString(),
  body('cookingTimeMinutes').optional().isInt({ min: 0 }),
  body('category').isMongoId(),
  body('ingredients').optional(),
  body('instructions').optional(),
];

export const createRecipe = asyncHandler(async (req, res) => {
  const {
    title,
    description = '',
    category,
  } = req.body;
  const cookingTimeMinutes = Number(req.body.cookingTimeMinutes) || 0;
  const ingredients = parseStringArray(req.body.ingredients);
  const instructions = parseStringArray(req.body.instructions);
  const cat = await Category.findById(category);
  if (!cat) {
    res.status(400).json({ message: 'Invalid category' });
    return;
  }
  let imageUrl = '';
  if (req.file) {
    if (isCloudinaryConfigured()) {
      const upload = await uploadImageBuffer(req.file.buffer, { folder: 'recipe_nest/recipes' });
      imageUrl = upload.secure_url;
    } else {
      imageUrl = `/uploads/${req.file.filename}`;
    }
  }
  const recipe = await Recipe.create({
    title,
    description,
    cookingTimeMinutes,
    category,
    chef: req.user._id,
    ingredients,
    instructions,
    imageUrl,
    status: 'pending',
  });
  const populated = await Recipe.findById(recipe._id).populate(populateRecipe);
  res.status(201).json({ recipe: populated });
});

export const updateRecipeValidators = [
  param('id').isMongoId(),
  body('title').optional().trim().notEmpty(),
  body('description').optional().isString(),
  body('cookingTimeMinutes').optional().isInt({ min: 0 }),
  body('category').optional().isMongoId(),
  body('ingredients').optional(),
  body('instructions').optional(),
];

export const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404).json({ message: 'Recipe not found' });
    return;
  }
  const isOwner = recipe.chef.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    res.status(403).json({ message: 'Not allowed' });
    return;
  }
  const updates = { ...req.body };
  if (req.body.cookingTimeMinutes !== undefined) {
    updates.cookingTimeMinutes = Number(req.body.cookingTimeMinutes) || 0;
  }
  if (req.body.ingredients !== undefined) {
    updates.ingredients = parseStringArray(req.body.ingredients);
  }
  if (req.body.instructions !== undefined) {
    updates.instructions = parseStringArray(req.body.instructions);
  }
  if (req.file) {
    if (isCloudinaryConfigured()) {
      const upload = await uploadImageBuffer(req.file.buffer, { folder: 'recipe_nest/recipes' });
      updates.imageUrl = upload.secure_url;
    } else {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }
  }
  if (updates.category) {
    const cat = await Category.findById(updates.category);
    if (!cat) {
      res.status(400).json({ message: 'Invalid category' });
      return;
    }
  }
  if (!isAdmin && isOwner) {
    updates.status = 'pending';
    updates.rejectionReason = '';
  }
  const allowed = [
    'title',
    'description',
    'cookingTimeMinutes',
    'category',
    'ingredients',
    'instructions',
    'imageUrl',
    'status',
    'rejectionReason',
  ];
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      recipe[key] = updates[key];
    }
  }
  await recipe.save();
  const populated = await Recipe.findById(recipe._id).populate(populateRecipe);
  res.json({ recipe: populated });
});

export const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404).json({ message: 'Recipe not found' });
    return;
  }
  const isOwner = recipe.chef.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    res.status(403).json({ message: 'Not allowed' });
    return;
  }
  await Review.deleteMany({ recipe: recipe._id });
  await recipe.deleteOne();
  res.json({ message: 'Recipe deleted' });
});

export const listRecipeReviewsValidators = [param('id').isMongoId()];

export const listRecipeReviews = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404).json({ message: 'Recipe not found' });
    return;
  }
  if (!canViewRecipe(recipe, req.user)) {
    res.status(404).json({ message: 'Recipe not found' });
    return;
  }
  const filter = { recipe: recipe._id, hidden: false };
  if (req.user?.role === 'admin') {
    delete filter.hidden;
  }
  const reviews = await Review.find(filter)
    .populate('user', 'name avatarUrl')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ reviews });
});

export const postReviewValidators = [
  param('id').isMongoId(),
  body('comment').trim().notEmpty().isLength({ max: 2000 }),
  body('rating').optional().isInt({ min: 1, max: 5 }),
];

export const postReview = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe || recipe.status !== 'approved') {
    res.status(404).json({ message: 'Recipe not found' });
    return;
  }
  const { comment, rating } = req.body;
  try {
    const review = await Review.create({
      recipe: recipe._id,
      user: req.user._id,
      comment,
      rating,
    });
    await recalcRecipeRating(recipe._id);
    const populated = await Review.findById(review._id).populate('user', 'name avatarUrl');
    res.status(201).json({ review: populated });
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).json({ message: 'You already reviewed this recipe' });
      return;
    }
    throw e;
  }
});

async function recalcRecipeRating(recipeId) {
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

export const toggleLike = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe || recipe.status !== 'approved') {
    res.status(404).json({ message: 'Recipe not found' });
    return;
  }
  const uid = req.user._id.toString();
  const idx = recipe.likes.map((id) => id.toString()).indexOf(uid);
  if (idx === -1) {
    recipe.likes.push(req.user._id);
  } else {
    recipe.likes.splice(idx, 1);
  }
  await recipe.save();
  res.json({ likes: recipe.likes.length, liked: idx === -1 });
});
