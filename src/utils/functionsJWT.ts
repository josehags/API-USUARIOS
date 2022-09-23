import jwt = require('jsonwebtoken');
import auth from '../config/auth';

function verifyJWT(request, response, NextFunction) {
  const token = request.headers['x-access-token'];

  if (!token) {
    return request
      .status(401)
      .json({ auth: false, message: 'O token não foi fornecido!' });
  }

  return jwt.verify(token, auth.jwt.secret, (err, decoded) => {
    if (err) {
      return response
        .status(500)
        .json({ auth: false, message: 'Não foi possível autenticar o token!' });
    }
    request.userId = decoded.id;
    NextFunction();
    return undefined;
  });
}

export { verifyJWT };
