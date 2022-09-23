import { verify } from 'jsonwebtoken';
import jwt = require('jsonwebtoken');
import { nextTick } from 'process';
import authConfig from '../config/auth';

function verifyJWT(request, response, Next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return request
      .status(401)
      .json({ auth: false, message: 'O token não foi fornecido!' });
  }

  const [, token] = authHeader.split(' ');
  try {
    const decodedToken = verify(token, authConfig.jwt.secret);
    return next();
  } catch (error) {}
  //   return jwt.verify(token, process.env.SECRET, (err, decoded) => {
  //     if (err) {
  //       return response
  //         .status(500)
  //         .json({ auth: false, message: 'Não foi possível autenticar o token!' });
  //     }
  //     request.userId = decoded.id;
  //     NextFunction();
  //     return undefined;
  //   });
}
