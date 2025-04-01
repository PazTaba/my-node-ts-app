// middleware/authMiddleware.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtPayloadCustom } from '../types/AuthRequest';

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = typeof authHeader === 'string' ? authHeader.replace('Bearer ', '') : null;

  if (!token) {
    return res.status(401).json({ message: 'אין הרשאה. טוקן לא סופק' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'defaultSecret'
    ) as JwtPayloadCustom;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'טוקן לא תקף' });
  }
};

export default authMiddleware;
