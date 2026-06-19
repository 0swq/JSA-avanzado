// @ts-nocheck
import { Router } from 'express';
import { reservaControlador } from './reserva.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearReservaSchema, actualizarReservaSchema, filtroReservaSchema } from './reserva.validator';

const router = Router();
router.use(middlewareAutenticacion);

router.get('/', middlewareRol(['admin', 'bibliotecario']), validar(filtroReservaSchema, 'query'), reservaControlador.obtenerTodos);
router.get('/usuario/:usuarioId', reservaControlador.obtenerPorUsuario);
router.get('/:id', reservaControlador.obtenerPorId);
router.post('/', middlewareRol(['admin', 'bibliotecario']), validar(crearReservaSchema), reservaControlador.crear);
router.patch('/:id', middlewareRol(['admin', 'bibliotecario']), validar(actualizarReservaSchema), reservaControlador.actualizar);
router.delete('/:id', middlewareRol(['admin']), reservaControlador.eliminar);

export default router;
