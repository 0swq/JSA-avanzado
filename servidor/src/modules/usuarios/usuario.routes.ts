import {Router} from 'express';
import {crearUsuarioSchema, actualizarUsuarioSchema} from './usuario.validator';
import {usuarioControlador} from "@modules/usuarios/usuario.controller";
import {middlewareAutenticacion} from "@middlewares/auth.middleware";
import {middlewareRol} from "@middlewares/role.middleware";
import {validar} from "@middlewares/validate.middleware";

const router = Router();

router.post('/login', validar(crearUsuarioSchema), usuarioControlador.login);

router.use(middlewareAutenticacion);

router.get('/', middlewareRol(['admin', 'bibliotecario']), validar(crearUsuarioSchema), usuarioControlador.obtenerTodos);
router.get('/:id', middlewareRol(['admin', 'bibliotecario']), usuarioControlador.obtenerPorId);
router.post('/', middlewareRol(['admin']), validar(crearUsuarioSchema), usuarioControlador.crear);
router.patch('/:id', middlewareRol(['admin']), validar(actualizarUsuarioSchema), usuarioControlador.actualizar);
router.delete('/:id', middlewareRol(['admin']), usuarioControlador.eliminar);

export default router;