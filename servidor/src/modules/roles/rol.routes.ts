// @ts-nocheck
import { Router } from 'express';
import { rolControlador } from './rol.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearRolSchema, actualizarRolSchema } from './rol.validator';

const router = Router();
router.use(middlewareAutenticacion);

router.get('/', middlewareRol(['admin']), rolControlador.obtenerTodos);
router.get('/:id', middlewareRol(['admin']), rolControlador.obtenerPorId);
router.post('/', middlewareRol(['admin']), validar(crearRolSchema), rolControlador.crear);
router.patch('/:id', middlewareRol(['admin']), validar(actualizarRolSchema), rolControlador.actualizar);
router.delete('/:id', middlewareRol(['admin']), rolControlador.eliminar);

export default router;
