import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest.js';
import { contactValidators, submitContact } from '../controllers/contactController.js';

const router = Router();

router.post('/', contactValidators, validateRequest, submitContact);

export default router;

