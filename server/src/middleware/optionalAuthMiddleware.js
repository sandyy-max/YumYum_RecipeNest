import User from '../models/User.js';
import { verifyToken } from '../utils/generateToken.js';

export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next();
    return;
  }
  const token = header.slice(7);
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (user && user.accountStatus === 'active') {
      req.user = user;
    }
  } catch {
    /* ignore invalid token for public routes */
  }
  next();
}
