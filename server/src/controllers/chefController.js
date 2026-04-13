import { asyncHandler } from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

const populateRecipe = [
  { path: 'category', select: 'name slug' },
  { path: 'chef', select: 'name email' },
];

export const myRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find({ chef: req.user._id })
    .populate(populateRecipe)
    .sort({ createdAt: -1 })
    .lean();
  res.json({ recipes });
});

export const chefDashboard = asyncHandler(async (req, res) => {
  const chefId = req.user._id;
  const list = await Recipe.find({ chef: chefId }).select('likes viewCount status').lean();
  const totalRecipes = list.length;
  const pending = list.filter((r) => r.status === 'pending').length;
  const approved = list.filter((r) => r.status === 'approved').length;
  const totalLikes = list.reduce((acc, r) => acc + (r.likes?.length || 0), 0);
  const totalViews = list.reduce((acc, r) => acc + (r.viewCount || 0), 0);
  res.json({
    totalRecipes,
    pending,
    approved,
    rejected: list.filter((r) => r.status === 'rejected').length,
    totalLikes,
    totalViews,
    followers: 0,
  });
});

export const listActiveChefs = asyncHandler(async (_req, res) => {
  const chefs = await User.find({ role: 'chef', accountStatus: 'active' })
    .select('name email cuisineSpecialty avatarUrl')
    .sort({ createdAt: -1 })
    .lean();

  if (!chefs.length) {
    res.json({ chefs: [] });
    return;
  }

  const chefIds = chefs.map((c) => c._id);
  const recipes = await Recipe.find({ status: 'approved', chef: { $in: chefIds } })
    .populate('category', 'name slug')
    .select('title imageUrl cookingTimeMinutes category likes averageRating createdAt')
    .lean()
    .sort({ createdAt: -1 });

  const recipesByChef = new Map();
  for (const r of recipes) {
    const key = String(r.chef);
    const list = recipesByChef.get(key) || [];
    list.push(r);
    recipesByChef.set(key, list);
  }

  const enriched = chefs.map((c) => {
    const list = recipesByChef.get(String(c._id)) || [];
    return {
      ...c,
      recipesCount: list.length,
      recipes: list.slice(0, 6),
    };
  });

  res.json({ chefs: enriched });
});
