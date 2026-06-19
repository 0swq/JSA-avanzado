// @ts-nocheck
import { Router } from 'express';
import { prestamoControlador } from './prestamo.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearPrestamoSchema, actualizarPrestamoSchema, filtroPrestamoSchema } from './prestamo.validator';

const router = Router();
router.use(middlewareAutenticacion);

router.get('/', middlewareRol(['admin', 'bibliotecario']), validar(filtroPrestamoSchema, 'query'), prestamoControlador.obtenerTodos);
router.get('/usuario/:usuarioId', prestamoControlador.obtenerPorUsuario);
router.get('/:id', prestamoControlador.obtenerPorId);
router.post('/', middlewareRol(['admin', 'bibliotecario']), validar(crearPrestamoSchema), prestamoControlador.crear);
router.patch('/:id', middlewareRol(['admin', 'bibliotecario']), validar(actualizarPrestamoSchema), prestamoControlador.actualizar);
router.delete('/:id', middlewareRol(['admin']), prestamoControlador.eliminar);

export default router;
