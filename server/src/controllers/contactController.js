import { body } from 'express-validator';
import { asyncHandler } from '../middleware/asyncHandler.js';
import ContactMessage from '../models/ContactMessage.js';

export const contactValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('reason').trim().notEmpty().withMessage('Message is required'),
];

export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, reason } = req.body;
  const msg = await ContactMessage.create({ name, email, reason });
  res.status(201).json({ message: 'Submitted', contact: msg });
});

export const listContacts = asyncHandler(async (_req, res) => {
  const contacts = await ContactMessage.find()
    .sort({ createdAt: -1 })
    .lean();
  res.json({ contacts });
});

