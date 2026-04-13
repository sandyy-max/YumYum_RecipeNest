import { validationResult } from 'express-validator';

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    res.status(400).json({
      message: first?.msg || 'Validation failed',
      errors: errors.array(),
    });
    return;
  }
  next();
}
