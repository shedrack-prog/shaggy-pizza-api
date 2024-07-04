const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong, Try again later';
  return res.status(statusCode).json({ message });
};

export default errorHandlerMiddleware;
