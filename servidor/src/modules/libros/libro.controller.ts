// @ts-nocheck
import {Request, Response, NextFunction} from 'express';
import {libroServicio} from './libro.service';
import {RespuestaLibroDto} from './libro.dto';

export const libroControlador = {
    async obtenerTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const {pagina, porPagina, ...filtros} = req.query;
            const resultado = await libroServicio.obtenerTodos({
                ...filtros,
                pagina: pagina ? Number(pagina) : undefined,
                porPagina: porPagina ? Number(porPagina) : undefined,
            });
            res.json({success: true, ...resultado});
        } catch (error) {
            next(error);
        }
    },

    async obtenerPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const libro = await libroServicio.obtenerPorId(id);
            res.json({success: true, data: libro});
        } catch (error) {
            next(error);
        }
    },


    async crear(req: Request, res: Response, next: NextFunction) {
        try {
            const libro: RespuestaLibroDto = await libroServicio.crear(req.body);
            res.status(201).json({success: true, data: libro});
        } catch (error) {
            next(error);
        }
    },

    async actualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const libro = await libroServicio.actualizar(id, req.body);
            res.json({success: true, data: libro});
        } catch (error) {
            next(error);
        }
    },

    async eliminar(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            await libroServicio.eliminar(id);
            res.json({success: true, mensaje: 'Libro eliminado correctamente'});
        } catch (error) {
            next(error);
        }
    },
    async solicitarGrafo(req: Request, res: Response, next: NextFunction) {
        try {
            const { q } = req.query;
            const resultado = await libroServicio.solicitarGrafo(q as string);
            res.json({ success: true, ...resultado });
        } catch (error) {
            next(error);
        }
    },

    async buscar(req: Request, res: Response, next: NextFunction) {
        try {
            const {q, pagina, porPagina} = req.query;
            const resultado = await libroServicio.buscar(
                q as string,
                pagina ? Number(pagina) : undefined,
                porPagina ? Number(porPagina) : undefined,
            );
            res.json({success: true, ...resultado});
        } catch (error) {
            next(error);
        }
    },
};
