// @ts-nocheck
import { Router } from 'express';
import { pagoMultaControlador } from './pago-multa.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearPagoMultaSchema, actualizarPagoMultaSchema } from './pago-multa.validator';

const router = Router();
router.use(middlewareAutenticacion);

router.get('/', middlewareRol(['admin', 'bibliotecario']), pagoMultaControlador.obtenerTodos);
router.get('/multa/:multaId', pagoMultaControlador.obtenerPorMulta);
router.get('/:id', pagoMultaControlador.obtenerPorId);
router.post('/', middlewareRol(['admin', 'bibliotecario']), validar(crearPagoMultaSchema), pagoMultaControlador.crear);
router.patch('/:id', middlewareRol(['admin']), validar(actualizarPagoMultaSchema), pagoMultaControlador.actualizar);
router.delete('/:id', middlewareRol(['admin']), pagoMultaControlador.eliminar);

export default router;
