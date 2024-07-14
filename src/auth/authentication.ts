import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}

class AuthMiddleware {
   public authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            const header = req.headers['authorization'];
            if (!header) {
                return res.status(400).json({ error: 'NO AUTH HEADER FOUND - UNAUTHORIZED' });
            }
            const token = header.split(' ')[1];
            if (!token) {
                return res.status(401).json('🔐 TOKEN NOT FOUND');
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            if (!decoded) {
                return res.status(401).json({error: 'UNAUTHORIZED ENTRY 🔥'});   
            }
            req.user = decoded;
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json(error);
        }
    }

public isAdmin(req: Request, res: Response, next: NextFunction) {
  if ( req.user.role !== 'admin') {
      return res.status(403).json({ message: 'ONLY ADMIN CAN USE THIS ROUTE' });
  }
  next();
}
}
export default  AuthMiddleware;
