// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearReservaDto, ActualizarReservaDto, RespuestaReservaDto } from './reserva.dto';
import { reservaRepositorio } from './reserva.repository';

const LIMITE = 3;

export const reservaServicio = {
  obtenerTodos(filtros: any = {}): Promise<RespuestaReservaDto[]> {
    return reservaRepositorio.obtenerTodos(filtros);
  },

  async obtenerPorId(id: string): Promise<RespuestaReservaDto> {
    const reserva = await reservaRepositorio.obtenerPorId(id);
    if (!reserva) throw ApiError.noEncontrado('Reserva no encontrada');
    return reserva;
  },

  obtenerPorUsuario(usuarioId: string): Promise<RespuestaReservaDto[]> {
    return reservaRepositorio.obtenerPorUsuario(usuarioId);
  },

  async crear(data: CrearReservaDto & { usuarioId: string }): Promise<RespuestaReservaDto> {
    const activas = await reservaRepositorio.contarActivasPorUsuario(data.usuarioId);
    if (activas >= LIMITE) {
      throw ApiError.conflicto(`Has alcanzado el límite de ${LIMITE} reservas activas`);
    }
    return reservaRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarReservaDto): Promise<RespuestaReservaDto> {
    const reserva = await reservaRepositorio.obtenerPorId(id);
    if (!reserva) throw ApiError.noEncontrado('Reserva no encontrada');
    return reservaRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    if (!await reservaRepositorio.obtenerPorId(id)) throw ApiError.noEncontrado('Reserva no encontrada');
    await reservaRepositorio.eliminar(id);
  },
};
