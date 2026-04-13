import { Router } from 'express';
import { listActiveChefs } from '../controllers/chefController.js';

const router = Router();

router.get('/', listActiveChefs);

export default router;

