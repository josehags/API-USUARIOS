import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function verifyJWT(request: Request, response: Response, next: NextFunction) {
  const token = request.headers['x-access-token'];

  if (!token) {
    return response.status(401).json({ auth: false, message: 'O token não foi fornecido!' });
  }

  return jwt.verify(token as string, process.env.SECRET, (err: any, decoded: { id: any; }) => {
    if (err) {
      return response.status(500).json({ auth: false, message: 'Não foi possível autenticar o token!' });
    }
    request.params.userId = decoded.id;
    next();
    return undefined;
  });
}
