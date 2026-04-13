import User from '../models/User.js';
import { verifyToken } from '../utils/generateToken.js';
import { asyncHandler } from './asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    token = header.slice(7);
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    if (user.accountStatus === 'suspended') {
      res.status(403).json({ message: 'Account suspended' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
});
