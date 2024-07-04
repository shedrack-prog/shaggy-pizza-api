const adminMiddleware = (req, res, next) => {
  const isAdmin = req.user.role === 'admin';
  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: 'You are not allowed to access this route' });
  }
  next();
};

export default adminMiddleware;
