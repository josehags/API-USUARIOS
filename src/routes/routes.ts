import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { verifyJWT } from '../utils/functionsJWT';

const router = Router();
const usuarioController = new UsuarioController();

/*
    5 métodos de requisição HTTP mais utilizados:
    GET => Busca
    POST => salvar
    PUT => Alterar
    DELETE => Deletar
    PATCH => Alteração específica
*/

router.post('/signup', usuarioController.create);
router.post('/login', usuarioController.login);
router.post('/recover-password', usuarioController.recoverPassword);
router.get('/usuarios', verifyJWT, usuarioController.all);
router.get('/usuarios/:id', verifyJWT, usuarioController.one);
router.put('/usuarios/:id', verifyJWT, usuarioController.update);
router.put('/change-password/:id', verifyJWT, usuarioController.changePassword);
router.delete('/usuarios/:id', verifyJWT, usuarioController.remove);
router.patch('/usuarios/:id', verifyJWT, usuarioController.restore);

//routes.get('/users/newest-four', verify.verifyJWT, UserController.newestFourUsersGet);
//routes.get('/users/:id', verifyJWT, UserController.access);
//routes.get('/users', verify.verifyJWT, UserController.signUpGet);
//routes.post('/signup', UserController.signUpPost);
//routes.post('/login', UserController.login);
//routes.post('/recover-password', UserController.recoverPassword);
//routes.put('/change-password/:id', verify.verifyJWT, UserController.changePassword);
//routes.put('/users/update/:id', verify.verifyJWT, UserController.signUpPut);
//routes.delete('/users/delete/:id', verify.verifyJWT, UserController.toggleUser);

router.get('/generateToken', usuarioController.token);

export { router }; // Retornando as rotas preenchidas para o server.ts
