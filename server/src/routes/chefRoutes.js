import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { requireRoles } from '../middleware/roleMiddleware.js';
import { chefDashboard, myRecipes } from '../controllers/chefController.js';

const router = Router();

router.use(protect, requireRoles('chef', 'admin'));

router.get('/dashboard', chefDashboard);
router.get('/recipes', myRecipes);

export default router;
