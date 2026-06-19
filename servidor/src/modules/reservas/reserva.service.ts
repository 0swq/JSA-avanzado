// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearReservaDto, ActualizarReservaDto, RespuestaReservaDto } from './reserva.dto';
import { reservaRepositorio } from './reserva.repository';

export const reservaServicio = {
  obtenerTodos(filtros: any = {}): Promise<RespuestaReservaDto[]> {
    return reservaRepositorio.obtenerTodos(filtros);
  },

  obtenerPorUsuario(usuarioId: string): Promise<RespuestaReservaDto[]> {
    return reservaRepositorio.obtenerPorUsuario(usuarioId);
  },

  async obtenerPorId(id: string): Promise<RespuestaReservaDto> {
    const reserva = await reservaRepositorio.obtenerPorId(id);
    if (!reserva) throw ApiError.noEncontrado('Reserva no encontrada');
    return reserva;
  },

  crear(data: CrearReservaDto): Promise<RespuestaReservaDto> {
    return reservaRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarReservaDto): Promise<RespuestaReservaDto> {
    await this.obtenerPorId(id);
    return reservaRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    await this.obtenerPorId(id);
    await reservaRepositorio.eliminar(id);
  },
};
