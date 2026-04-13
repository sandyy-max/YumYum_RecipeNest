import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { optionalAuth } from '../middleware/optionalAuthMiddleware.js';
import { requireRoles } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { uploadRecipeImage } from '../middleware/uploadMiddleware.js';
import {
  createRecipe,
  createRecipeValidators,
  deleteRecipe,
  getRecipeById,
  getRecipeValidators,
  listRecipeReviews,
  listRecipeReviewsValidators,
  listRecipes,
  listRecipesValidators,
  postReview,
  postReviewValidators,
  toggleLike,
  updateRecipe,
  updateRecipeValidators,
} from '../controllers/recipeController.js';

const router = Router();

router.get('/', listRecipesValidators, validateRequest, listRecipes);

router.get(
  '/:id/reviews',
  optionalAuth,
  listRecipeReviewsValidators,
  validateRequest,
  listRecipeReviews
);

router.post(
  '/:id/reviews',
  protect,
  requireRoles('user', 'chef', 'admin'),
  postReviewValidators,
  validateRequest,
  postReview
);

router.post('/:id/like', protect, requireRoles('user', 'chef', 'admin'), toggleLike);

router.get('/:id', optionalAuth, getRecipeValidators, validateRequest, getRecipeById);

router.post(
  '/',
  protect,
  requireRoles('chef', 'admin'),
  uploadRecipeImage.single('image'),
  createRecipeValidators,
  validateRequest,
  createRecipe
);

router.put(
  '/:id',
  protect,
  requireRoles('chef', 'admin'),
  uploadRecipeImage.single('image'),
  updateRecipeValidators,
  validateRequest,
  updateRecipe
);

router.delete('/:id', protect, requireRoles('chef', 'admin'), deleteRecipe);

export default router;
