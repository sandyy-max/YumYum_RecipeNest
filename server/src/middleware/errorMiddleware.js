import multer from 'multer';

export function notFound(req, res) {
  res.status(404).json({ message: `Not found: ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Body parser JSON errors
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'Invalid JSON body' });
    return;
  }

  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: err.message });
    return;
  }
  if (err.message === 'Only image files are allowed') {
    res.status(400).json({ message: err.message });
    return;
  }

  // Mongoose duplicate key (e.g. email already exists)
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'field';
    res.status(400).json({ message: `${field} already exists` });
    return;
  }

  // Mongoose validation errors
  if (err?.name === 'ValidationError') {
    const first = Object.values(err.errors || {})[0];
    res.status(400).json({ message: first?.message || 'Validation failed' });
    return;
  }

  // Invalid ObjectId
  if (err?.name === 'CastError') {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  const status = err.statusCode || 500;
  const message = err.message || 'Server error';
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && err.stack ? { stack: err.stack } : {}),
  });
}
