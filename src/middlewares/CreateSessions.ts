import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import { UsuarioController } from '../controllers/UsuarioController';
import AppError from '../errors/appErros';

import { Usuario } from '../models/Usuario';

interface IRequest {
  email: string;
  password: string;
}
interface IResponse {
  user: Usuario;
  token: string;
}

class CreateSessionsService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usuariosRepository = new UsuarioController();

    const user = await usuariosRepository.findByEmail(email);

    // if (!user) {
    //   //criar mensagem de error para aparecer no insomnia
    //   return console.log('Senha não confere com a do Usuario');
    // }

    const passwordConfirmed = await compare(password, user.password);

    // if (!passwordConfirmed) {
    //   //criar mensagem de error para aparecer no insomnia
    //   // eslint-disable-next-line no-console
    //   return console.log('Senha não confere com a do Usuario');
    // }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      //validade do token é de 1 dia
      expiresIn: authConfig.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default CreateSessionsService;
