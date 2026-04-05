const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  console.error('Unhandled error:', err);

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ error: `${field} already exists` });
  }

  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;
