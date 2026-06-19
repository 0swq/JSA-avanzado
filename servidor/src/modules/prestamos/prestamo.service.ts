// @ts-nocheck
import { ApiError } from '@utils/ApiError';
import { CrearPrestamoDto, ActualizarPrestamoDto, RespuestaPrestamoDto } from './prestamo.dto';
import { prestamoRepositorio } from './prestamo.repository';

export const prestamoServicio = {
  obtenerTodos(filtros: any = {}): Promise<RespuestaPrestamoDto[]> {
    return prestamoRepositorio.obtenerTodos(filtros);
  },

  obtenerPorUsuario(usuarioId: string): Promise<RespuestaPrestamoDto[]> {
    return prestamoRepositorio.obtenerPorUsuario(usuarioId);
  },

  async obtenerPorId(id: string): Promise<RespuestaPrestamoDto> {
    const prestamo = await prestamoRepositorio.obtenerPorId(id);
    if (!prestamo) throw ApiError.noEncontrado('Préstamo no encontrado');
    return prestamo;
  },

  crear(data: CrearPrestamoDto): Promise<RespuestaPrestamoDto> {
    return prestamoRepositorio.crear(data);
  },

  async actualizar(id: string, data: ActualizarPrestamoDto): Promise<RespuestaPrestamoDto> {
    await this.obtenerPorId(id);
    return prestamoRepositorio.actualizar(id, data);
  },

  async eliminar(id: string): Promise<void> {
    await this.obtenerPorId(id);
    await prestamoRepositorio.eliminar(id);
  },
};
