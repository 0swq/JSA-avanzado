// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearMultaDto, ActualizarMultaDto, RespuestaMultaDto } from './multa.dto';
import { multaRepositorio } from './multa.repository';

export const multaServicio = {
  obtenerTodos(filtros: any = {}): Promise<RespuestaMultaDto[]> {
    return multaRepositorio.obtenerTodos(filtros);
  },

  obtenerPorUsuario(usuarioId: string): Promise<RespuestaMultaDto[]> {
    return multaRepositorio.obtenerPorUsuario(usuarioId);
  },

  async obtenerPorId(id: string): Promise<RespuestaMultaDto> {
    const multa = await multaRepositorio.obtenerPorId(id);
    if (!multa) throw ApiError.noEncontrado('Multa no encontrada');
    return multa;
  },

  crear(data: CrearMultaDto): Promise<RespuestaMultaDto> {
    return multaRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarMultaDto): Promise<RespuestaMultaDto> {
    await this.obtenerPorId(id);
    return multaRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    await this.obtenerPorId(id);
    await multaRepositorio.eliminar(id);
  },
};
