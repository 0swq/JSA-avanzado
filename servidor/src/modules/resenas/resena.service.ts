// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearResenaDto, ActualizarResenaDto, RespuestaResenaDto } from './resena.dto';
import { resenaRepositorio } from './resena.repository';

export const resenaServicio = {
  obtenerPorLibro(libroId: string): Promise<RespuestaResenaDto[]> {
    return resenaRepositorio.obtenerPorLibro(libroId);
  },

  obtenerPorUsuario(usuarioId: string): Promise<RespuestaResenaDto[]> {
    return resenaRepositorio.obtenerPorUsuario(usuarioId);
  },

  async obtenerPorId(id: string): Promise<RespuestaResenaDto> {
    const resena = await resenaRepositorio.obtenerPorId(id);
    if (!resena) throw ApiError.noEncontrado('Reseña no encontrada');
    return resena;
  },

  crear(data: CrearResenaDto): Promise<RespuestaResenaDto> {
    return resenaRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarResenaDto): Promise<RespuestaResenaDto> {
    await this.obtenerPorId(id);
    return resenaRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    await this.obtenerPorId(id);
    await resenaRepositorio.eliminar(id);
  },
};
