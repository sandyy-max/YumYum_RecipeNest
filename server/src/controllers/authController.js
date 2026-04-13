import { body } from 'express-validator';
import User from '../models/User.js';
import { signToken } from '../utils/generateToken.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const userSafe = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  accountStatus: user.accountStatus,
  avatarUrl: user.avatarUrl,
  cuisineSpecialty: user.cuisineSpecialty,
  createdAt: user.createdAt,
});

export const registerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
  body('role')
    .optional()
    .isIn(['user', 'chef'])
    .withMessage('Invalid role'),
];

export const loginValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400).json({ message: 'Email already registered' });
    return;
  }
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  const token = signToken({ id: user._id.toString(), role: user.role });
  res.status(201).json({ token, user: userSafe(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }
  if (user.accountStatus === 'suspended') {
    res.status(403).json({ message: 'Account suspended' });
    return;
  }
  const token = signToken({ id: user._id.toString(), role: user.role });
  res.json({ token, user: userSafe(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: userSafe(req.user) });
});
