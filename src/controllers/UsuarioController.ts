import { NextFunction, Request, Response } from 'express';
import { Usuario } from '../models/Usuario';
import { APPDataSource } from '../database/data-source';

import * as yup from 'yup';
// import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as hash from '../Utils/hashPass';
import * as mailer from '../Utils/mailer';
import { generateStrongPassword } from '../Utils/generateStrongPassword';

export class UsuarioController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { name, email, role, sector, image } = request.body;

    const { transporter } = mailer;

    //    const temporaryPassword = crypto.randomBytes(8).toString('hex');
    const temporaryPassword = generateStrongPassword(15);

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      role: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      console.log(err);
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const usuariosRepository = APPDataSource.getRepository(Usuario);

    const usuarioAlreadyExists = await usuariosRepository.findOne({
      where: { email: email },
    });

    if (usuarioAlreadyExists) {
      return response.status(400).json({ status: 'Usuario já existe!' });
    }

    const usuario = usuariosRepository.create({
      name,
      email,
      role,
      sector,
      image,
      password: await hash.hashPass(temporaryPassword),
      temporaryPassword: true,
    });

    await usuariosRepository.save(usuario);

    transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Senha temporária',
      text: `A sua senha temporária é: ${temporaryPassword}`,
    });
    console.log();
    return response.status(201).json(usuario);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const usuariosRepository = APPDataSource.getRepository(Usuario);

    const all = await usuariosRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const usuariosRepository = APPDataSource.getRepository(Usuario);

    const { id } = request.params;

    const one = await usuariosRepository.findOne({ where: { id: id } });

    if (one == null) {
      return response.json({ message: 'Este usuário não existe!' });
    }

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, email, role, sector, image } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      role: yup.string().required(),
      sector: yup.string().required(),
      image: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const usuariosRepository = APPDataSource.getRepository(Usuario);

    try {
      await usuariosRepository.update(
        { id },
        {
          name,
          email,
          role,
          sector,
          image,
        },
      );

      const usuarioUpdated = await usuariosRepository.findOne({
        where: { id: id },
      });

      return response.json(usuarioUpdated);
    } catch {
      return response
        .status(400)
        .json({ error: 'Não foi possivel alterar o cadastro!' });
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const usuariosRepository = APPDataSource.getRepository(Usuario);

    const usuarioToRemove = await usuariosRepository.findOneBy({
      id: request.params.id,
    });

    if (!usuarioToRemove) {
      return response.status(400).json({ status: 'Usuario não encontrado!' });
    }

    const deleteResponse = await usuariosRepository.softDelete(
      usuarioToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response.status(400).json({ status: 'Servidor não excluido!' });
    }

    return response.json(usuarioToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const usuariosRepository = APPDataSource.getRepository(Usuario);

    const usuarioToRestore = await usuariosRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!usuarioToRestore) {
      return response.status(400).json({ status: 'Usuário não encontrado!' });
    }

    const restoreResponse = await usuariosRepository.restore(
      usuarioToRestore.id,
    );

    if (restoreResponse.affected) {
      return response.status(200).json({ status: 'Usuário recuperado!' });
    }

    return response.json(usuariosRepository);
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const usuariosRepository = APPDataSource.getRepository(Usuario);

    const usuario = await usuariosRepository.findOne({
      where: { email: request.body.email },
    });

    if (usuario == null) {
      return response.json({ message: 'Este usuário não existe!' });
    }

    if (await bcrypt.compare(request.body.password, usuario.password)) {
      const { id } = usuario;
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 43200,
      });

      const profile = { ...usuario };
      delete profile.password;
      return response.json({ auth: true, token, profile });
    }

    return response.json({ message: 'Senha incorreta!' });
  }

  async recoverPassword(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const { email } = request.body;
    const { transporter } = mailer;

    const usuariosRepository = APPDataSource.getRepository(Usuario);

    //    const temporaryPassword = crypto.randomBytes(8).toString('hex');
    const temporaryPassword = generateStrongPassword(15);

    const usuarioAlreadyExists = await usuariosRepository.findOne({
      where: { email: request.body.email },
    });

    if (!usuarioAlreadyExists) {
      return response.json({ message: 'Não existe usuário com este email!' });
    }

    const { id } = usuarioAlreadyExists;
    try {
      const usuario = await usuariosRepository.update(
        { id },
        {
          password: await hash.hashPass(temporaryPassword),
          temporaryPassword: true,
        },
      );

      if (usuario == null) {
        return response
          .status(404)
          .json({ message: 'Este usuário não existe!' });
      }

      transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Senha temporária',
        text: `A sua senha temporária é: ${temporaryPassword}`,
      });
      console.log(temporaryPassword);
      return response.json({ message: 'Email enviado!' });
    } catch {
      return response
        .status(400)
        .json({ error: 'Não foi possivel enviar o email!' });
    }
  }

  async changePassword(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const { id } = request.params;
    const { password } = request.body;
    const usuariosRepository = APPDataSource.getRepository(Usuario);

    const schema = yup.object().shape({
      password: yup
        .string()
        .notRequired()
        .min(6, 'A senha deve ter pelo menos 6 caracteres'),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação da senha!' });
    }

    const usuarioAlreadyExists = await usuariosRepository.findOne({
      where: { id: id },
    });

    if (!usuarioAlreadyExists) {
      return response.json({ message: 'Este usuário não existe!' });
    }

    try {
      await usuariosRepository.update(
        { id },
        {
          password: await hash.hashPass(password),
          temporaryPassword: false,
        },
      );
      delete usuarioAlreadyExists.password;
      usuarioAlreadyExists.temporaryPassword = false;
      return response.json(usuarioAlreadyExists);
    } catch {
      return response
        .status(400)
        .json({ error: 'Não foi possivel alterar a senha!' });
    }
  }

  async token(request: Request, response: Response, next: NextFunction) {
    const id = 1;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 43200,
    });

    return response.json({ auth: true, token });
  }
}
