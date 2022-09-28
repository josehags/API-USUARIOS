import jwt = require('jsonwebtoken');
import bcrypt = require('bcrypt');
import { Usuario } from '../models/Usuario';

function verifyJWT(request, response, NextFunction) {
  const token = request.headers['x-access-token'];

  if (!token) {
    return request
      .status(401)
      .json({ auth: false, message: 'O token não foi fornecido!' });
  }

  return jwt.verify(token, process.env.SECRET, (err, decoded) => {
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

export const checkPassword = async (
  user: Usuario,
  password: string | Buffer,
) => {
  await bcrypt.compare(password, user.password);
};
export { verifyJWT };
