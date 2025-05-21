import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'seuSegredoSuperSecreto';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    res.status(401).json({ message: 'Token mal formatado' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;  
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
