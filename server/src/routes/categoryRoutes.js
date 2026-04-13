import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { requireRoles } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createCategory,
  createCategoryValidators,
  deleteCategory,
  listCategories,
  updateCategory,
  updateCategoryValidators,
} from '../controllers/categoryController.js';

const router = Router();

router.get('/', listCategories);

router.post(
  '/',
  protect,
  requireRoles('admin'),
  createCategoryValidators,
  validateRequest,
  createCategory
);

router.put(
  '/:id',
  protect,
  requireRoles('admin'),
  updateCategoryValidators,
  validateRequest,
  updateCategory
);

router.delete('/:id', protect, requireRoles('admin'), deleteCategory);

export default router;
