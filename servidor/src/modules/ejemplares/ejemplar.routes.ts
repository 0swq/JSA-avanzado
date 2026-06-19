// @ts-nocheck
import { Router } from 'express';
import { ejemplarControlador } from './ejemplar.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { middlewareRol } from '@middlewares/role.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearEjemplarSchema, actualizarEjemplarSchema } from './ejemplar.validator';

const router = Router();
router.use(middlewareAutenticacion);
router.use(middlewareRol(['admin', 'bibliotecario']));

router.get('/', ejemplarControlador.obtenerTodos);
router.get('/libro/:libroId', ejemplarControlador.obtenerPorLibro);
router.get('/:id', ejemplarControlador.obtenerPorId);
router.post('/', validar(crearEjemplarSchema), ejemplarControlador.crear);
router.patch('/:id', validar(actualizarEjemplarSchema), ejemplarControlador.actualizar);
router.delete('/:id', ejemplarControlador.eliminar);

export default router;
