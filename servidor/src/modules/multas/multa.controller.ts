// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { multaServicio } from './multa.service';
import { RespuestaMultaDto } from './multa.dto';

export const multaControlador = {
  async obtenerTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const multas: RespuestaMultaDto[] = await multaServicio.obtenerTodos(req.query);
      res.json({ success: true, data: multas });
    } catch (error) { next(error); }
  },

  async obtenerPorUsuario(req: Request, res: Response, next: NextFunction) {
    try {
      const multas: RespuestaMultaDto[] = await multaServicio.obtenerPorUsuario(req.params.usuarioId as string);
      res.json({ success: true, data: multas });
    } catch (error) { next(error); }
  },

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const multa: RespuestaMultaDto = await multaServicio.obtenerPorId(req.params.id as string);
      res.json({ success: true, data: multa });
    } catch (error) { next(error); }
  },

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const multa: RespuestaMultaDto = await multaServicio.crear(req.body);
      res.status(201).json({ success: true, data: multa });
    } catch (error) { next(error); }
  },

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const multa: RespuestaMultaDto = await multaServicio.actualizar(req.params.id as string, req.body);
      res.json({ success: true, data: multa });
    } catch (error) { next(error); }
  },

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      await multaServicio.eliminar(req.params.id as string);
      res.json({ success: true, mensaje: 'Multa eliminada correctamente' });
    } catch (error) { next(error); }
  },
};
