// @ts-nocheck
import {Router} from 'express';
import {libroControlador} from './libro.controller';
import {middlewareAutenticacion} from '@middlewares/auth.middleware';
import {middlewareRol} from '@middlewares/role.middleware';
import {validar} from '@middlewares/validate.middleware';
import {crearLibroSchema, actualizarLibroSchema, filtroLibroSchema} from './libro.validator';

const router = Router();

router.get('/', validar(filtroLibroSchema, 'query'), libroControlador.obtenerTodos);
router.get('/buscar', validar(filtroLibroSchema, 'query'), libroControlador.buscar);
router.get('/:id', libroControlador.obtenerPorId);
router.use(middlewareAutenticacion);

router.post('/', middlewareRol(['admin', 'bibliotecario']), validar(crearLibroSchema), libroControlador.crear);
router.patch('/:id', middlewareRol(['admin', 'bibliotecario']), validar(actualizarLibroSchema), libroControlador.actualizar);
router.delete('/:id', middlewareRol(['admin']), libroControlador.eliminar);

export default router;
