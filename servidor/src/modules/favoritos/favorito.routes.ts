// @ts-nocheck
import { Router } from 'express';
import { favoritoControlador } from './favorito.controller';
import { middlewareAutenticacion } from '@middlewares/auth.middleware';
import { validar } from '@middlewares/validate.middleware';
import { crearFavoritoSchema } from './favorito.validator';

const router = Router();
router.use(middlewareAutenticacion);

router.get('/usuario/:usuarioId', favoritoControlador.obtenerPorUsuario);
router.get('/:id', favoritoControlador.obtenerPorId);
router.post('/', validar(crearFavoritoSchema), favoritoControlador.crear);
router.delete('/:id', favoritoControlador.eliminar);

export default router;
