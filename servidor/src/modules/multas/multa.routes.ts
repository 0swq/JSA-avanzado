// @ts-nocheck
import { Router } from 'express';
import { multaControlador } from './multa.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearMultaSchema, actualizarMultaSchema, filtroMultaSchema } from './multa.validator';

const router = Router();
router.use(middlewareAutenticacion);

router.get('/', middlewareRol(['admin', 'bibliotecario']), validar(filtroMultaSchema, 'query'), multaControlador.obtenerTodos);
router.get('/usuario/:usuarioId', multaControlador.obtenerPorUsuario);
router.get('/:id', multaControlador.obtenerPorId);
router.post('/', middlewareRol(['admin', 'bibliotecario']), validar(crearMultaSchema), multaControlador.crear);
router.patch('/:id', middlewareRol(['admin']), validar(actualizarMultaSchema), multaControlador.actualizar);
router.delete('/:id', middlewareRol(['admin']), multaControlador.eliminar);

export default router;
