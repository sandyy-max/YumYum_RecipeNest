import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { requireRoles } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  addSaved,
  addSavedValidators,
  dashboardStats,
  listSaved,
  listSavedValidators,
  recentlyViewed,
  removeSaved,
  removeSavedValidators,
  updatePassword,
  updatePasswordValidators,
  updateProfile,
  updateProfileValidators,
} from '../controllers/userController.js';

const router = Router();

const userOrChef = requireRoles('user', 'chef', 'admin');

router.use(protect, userOrChef);

router.get('/me/dashboard', dashboardStats);
router.get('/me/recent', recentlyViewed);
router.get('/me/saved', listSavedValidators, validateRequest, listSaved);
router.post('/me/saved', addSavedValidators, validateRequest, addSaved);
router.delete('/me/saved/:recipeId', removeSavedValidators, validateRequest, removeSaved);

router.put('/me', updateProfileValidators, validateRequest, updateProfile);
router.put('/me/password', updatePasswordValidators, validateRequest, updatePassword);

export default router;
