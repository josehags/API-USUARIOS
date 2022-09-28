import { APPDataSource } from '../database/data-source';
import { Usuario } from '../models/Usuario';
import { sign } from 'jsonwebtoken';

import bcrypt = require('bcrypt');
import AppError from '../errors/appErros';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  usuario: Usuario;
  token: string;
  auth: true;
}
export class CreateSessionsService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usuariosRepository = APPDataSource.getRepository(Usuario);

    const usuario = await usuariosRepository.findOne({ where: { email } });

    if (!usuario) {
      console.log();
      console.error('Incorrect email combination......');
    }
    //ver se senha sai como verdadeira
    // console.log(await bcrypt.compare(password, usuario.password));
    const passwordConfirmed = await bcrypt.compare(password, usuario.password);

    if (!passwordConfirmed) {
      console.log();
      console.log('Incorrect password combination......');
    }
    const { id } = usuario;
    const token = sign({ id }, process.env.SECRET, {
      subject: usuario.id,
      expiresIn: 43200,
    });
    delete usuario.password;
    return { auth: true, usuario, token };
  }
}
