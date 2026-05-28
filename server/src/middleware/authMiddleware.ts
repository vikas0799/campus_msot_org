import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: 'super_admin' | 'campus_admin' | 'club_admin' | 'student';
    campus?: 'ghaziabad' | 'jaipur' | 'bangalore' | null;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"
    const jwtSecret = process.env.JWT_SECRET || 'campus_msot_jwt_secret_key_2026';

    jwt.verify(token, jwtSecret, (err, user: any) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized: Authentication token is required' });
  }
};

export const requireRoles = (roles: Array<'super_admin' | 'campus_admin' | 'club_admin' | 'student'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: Authentication required' });
    }

    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
    }
  };
};
