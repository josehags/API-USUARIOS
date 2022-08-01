"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const Usuario_1 = require("../models/Usuario");
const yup = __importStar(require("yup"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = require("jsonwebtoken");
const hash = require("../utils/hashPass");
const mailer = require("../utils/mailer");
const datesource_1 = require("../database/datesource");
class UsuarioController {
    async create(request, response, next) {
        const { name, email, role, sector, image } = request.body;
        const { transporter } = mailer;
        const temporaryPassword = crypto_1.default.randomBytes(8).toString('hex');
        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
            role: yup.string().required(),
        });
        try {
            await schema.validate(request.body, { abortEarly: false });
        }
        catch (err) {
            console.log(err);
            return response
                .status(400)
                .json({ status: 'Erro de validação dos campos!' });
        }
        const usuariosRepository = datesource_1.APPDataSource.getRepository(Usuario_1.Usuario);
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
            from: process.env.email,
            to: email,
            subject: 'Senha temporária SiGeD',
            text: `A sua senha temporária é: ${temporaryPassword}`,
        });
        return response.status(201).json(usuario);
    }
    async all(request, response, next) {
        const usuariosRepository = datesource_1.APPDataSource.getRepository(Usuario_1.Usuario);
        const all = await usuariosRepository.find();
        return response.json(all);
    }
    async one(request, response, next) {
        const usuariosRepository = datesource_1.APPDataSource.getRepository(Usuario_1.Usuario);
        const { id } = request.params;
        const one = await usuariosRepository.findOne({ where: { id: id } });
        if (one == null) {
            return response.json({ message: 'Este usuário não existe!' });
        }
        return response.json(one);
    }
    async update(request, response, next) {
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
        }
        catch (err) {
            return response
                .status(400)
                .json({ status: 'Erro de validação dos campos!' });
        }
        const usuariosRepository = datesource_1.APPDataSource.getRepository(Usuario_1.Usuario);
        const usuario = await usuariosRepository.update({ id }, {
            name,
            email,
            role,
            sector,
            image,
        });
        return response.status(201).json(usuario);
    }
    async remove(request, response, next) {
        const usuariosRepository = datesource_1.APPDataSource.getRepository(Usuario_1.Usuario);
        const usuarioToRemove = await usuariosRepository.findOneBy({
            id: request.params.id,
        });
        if (!usuarioToRemove) {
            return response.status(400).json({ status: 'Usuario não encontrado!' });
        }
        const deleteResponse = await usuariosRepository.softDelete(usuarioToRemove.id);
        if (!deleteResponse.affected) {
            return response.status(400).json({ status: 'Servidor não excluido!' });
        }
        return response.json(usuarioToRemove);
    }
    async restore(request, response, next) {
        const usuariosRepository = datesource_1.APPDataSource.getRepository(Usuario_1.Usuario);
        const usuarioToRestore = await usuariosRepository.findOne({
            where: { id: request.params.id },
            withDeleted: true,
        });
        if (!usuarioToRestore) {
            return response.status(400).json({ status: 'Usuário não encontrado!' });
        }
        const restoreResponse = await usuariosRepository.restore(usuarioToRestore.id);
        if (restoreResponse.affected) {
            return response.status(200).json({ status: 'Usuário recuperado!' });
        }
        return response.json(usuariosRepository);
    }
    async login(request, response, next) {
        const usuariosRepository = datesource_1.APPDataSource.getRepository(Usuario_1.Usuario);
        const usuario = await usuariosRepository.findOne({
            where: { id: request.body.id },
        });
        if (usuario == null) {
            return response.json({ message: 'Este usuário não existe!' });
        }
        if (await bcrypt_1.default.compare(request.body.password, usuario.password)) {
            const { id } = usuario;
            const token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: 43200,
            });
            delete usuario.password;
            return response.json({ auth: true, token, usuario });
        }
        return response.json({ message: 'Senha incorreta!' });
    }
    async recoverPassword(request, response, next) {
        const { email } = request.body;
        const { transporter } = mailer;
        const usuariosRepository = datesource_1.APPDataSource.getRepository(Usuario_1.Usuario);
        const temporaryPassword = crypto_1.default.randomBytes(8).toString('hex');
        const existeusuario = await usuariosRepository.findOne({
            where: { email: request.body.email },
        });
        if (!existeusuario) {
            return response.json({ message: 'Não existe usuário com este email!' });
        }
        const { id } = existeusuario;
        try {
            const usuario = await usuariosRepository.update({ id }, {
                password: await hash.hashPass(temporaryPassword),
                temporaryPassword: true,
            });
            if (usuario == null) {
                return response
                    .status(404)
                    .json({ message: 'Este usuário não existe!' });
            }
            transporter.sendMail({
                from: process.env.email,
                to: email,
                subject: 'Senha temporária SiGeD',
                text: `A sua senha temporária é: ${temporaryPassword}`,
            });
            return response.json({ message: 'Email enviado!' });
        }
        catch {
            return response
                .status(400)
                .json({ error: 'Não foi possivel enviar o email!' });
        }
    }
    async changePassword(request, response, next) {
        const { id } = request.params;
        const { password } = request.body;
        const usuariosRepository = datesource_1.APPDataSource.getRepository(Usuario_1.Usuario);
        const schema = yup.object().shape({
            password: yup
                .string()
                .notRequired()
                .min(6, 'A senha deve ter pelo menos 6 caracteres'),
        });
        try {
            await schema.validate(request.body, { abortEarly: false });
        }
        catch (err) {
            return response
                .status(400)
                .json({ status: 'Erro de validação da senha!' });
        }
        const existeusuario = await usuariosRepository.findOne({
            where: { id: request.body.id },
        });
        if (!existeusuario) {
            return response.json({ message: 'Este usuário não existe!' });
        }
        try {
            const usuario = await usuariosRepository.update({ id }, {
                password: await hash.hashPass(password),
                temporaryPassword: false,
            });
            return response.json(usuario);
        }
        catch {
            return response
                .status(400)
                .json({ error: 'Não foi possivel alterar a senha!' });
        }
    }
}
exports.UsuarioController = UsuarioController;
