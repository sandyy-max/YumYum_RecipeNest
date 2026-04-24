import { Router } from 'express';
import { param } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { requireRoles } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  analyticsOverview,
  categoryStats,
  deleteReview,
  deleteReviewValidators,
  listChefs,
  listChefsValidators,
  listPendingRecipes,
  listRecipeComments,
  listUsers,
  listUsersValidators,
  // kept as-is for backward compatibility
  setRecipeStatus,
  setRecipeStatusValidators,
  setReviewHidden,
  setReviewHiddenValidators,
  setUserStatus,
  setUserStatusValidators,
  updateChef,
  updateChefValidators,
} from '../controllers/adminController.js';
import { deleteContact, listContacts } from '../controllers/contactController.js';

const router = Router();

router.use(protect, requireRoles('admin'));

router.get('/users', listUsersValidators, validateRequest, listUsers);
router.patch('/users/:id/status', setUserStatusValidators, validateRequest, setUserStatus);

router.get('/chefs', listChefsValidators, validateRequest, listChefs);
router.patch('/chefs/:id', updateChefValidators, validateRequest, updateChef);

router.get('/recipes/pending', listPendingRecipes);
router.patch('/recipes/:id/status', setRecipeStatusValidators, validateRequest, setRecipeStatus);

router.patch('/reviews/:id', setReviewHiddenValidators, validateRequest, setReviewHidden);
router.get('/recipe-comments', listRecipeComments);
router.delete('/reviews/:id', deleteReviewValidators, validateRequest, deleteReview);

router.get('/analytics', analyticsOverview);
router.get('/analytics/categories', categoryStats);

router.get('/contacts', listContacts);
router.delete('/contacts/:id', param('id').isMongoId(), validateRequest, deleteContact);

export default router;
