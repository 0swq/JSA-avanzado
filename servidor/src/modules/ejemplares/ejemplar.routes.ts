// @ts-nocheck
import { Router } from 'express';
import { ejemplarControlador } from './ejemplar.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearEjemplarSchema, actualizarEjemplarSchema } from './ejemplar.validator';

const router = Router();

router.get('/', ejemplarControlador.obtenerTodos);
router.get('/libro/:libroId', ejemplarControlador.obtenerPorLibro);
router.get('/:id', ejemplarControlador.obtenerPorId);

router.use(middlewareAutenticacion);

router.post('/', middlewareRol(['admin', 'bibliotecario']), validar(crearEjemplarSchema), ejemplarControlador.crear);
router.patch('/:id', middlewareRol(['admin', 'bibliotecario']), validar(actualizarEjemplarSchema), ejemplarControlador.actualizar);
router.delete('/:id', middlewareRol(['admin']), ejemplarControlador.eliminar);

export default router;
