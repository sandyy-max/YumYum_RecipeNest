import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  login,
  loginValidators,
  me,
  register,
  registerValidators,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', registerValidators, validateRequest, register);
router.post('/login', loginValidators, validateRequest, login);
router.get('/me', protect, me);

export default router;
