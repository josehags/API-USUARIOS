import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { verifyJWT } from '../utils/functionsJWT';

const router = Router();
const usuarioController = new UsuarioController();
// const sessionsController = new SessionsController();

router.post('/signup', usuarioController.create);
router.post('/login', usuarioController.login);
router.post('/recover-password', usuarioController.recoverPassword);

// privada
//criação de sessão com token
router.post('/sessions', usuarioController.authenticate);

//criação de usuario
router.get('/usuarios', verifyJWT, usuarioController.all);
router.get('/usuarios/:id', verifyJWT, usuarioController.one);
router.put('/usuarios/:id', verifyJWT, usuarioController.update);
router.put('/change-password/:id', verifyJWT, usuarioController.changePassword);
router.delete('/usuarios/:id', usuarioController.remove);
router.patch('/usuarios/:id', verifyJWT, usuarioController.restore);

export { router }; // Retornando as rotas preenchidas para o server.ts
