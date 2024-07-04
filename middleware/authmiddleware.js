import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: 'You are not authorized to access this resource',
    });
  }
  try {
    jwt.verify(token, process.env.CREATE_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: 'You are not authorized to access this resource',
        });
      }
      const { userId, role } = decoded;
      req.user = { userId, role };
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: 'Authentication Invalid' });
  }
};
