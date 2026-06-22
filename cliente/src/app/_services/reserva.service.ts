import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio para el módulo Reservas.
 * Prefijo: /api/reservas
 * Estados: pendiente, activa, cancelada, completada
 * Límite: 3 reservas activas por usuario
 * Acceso admin/bibliotecario: CRUD completo
 * Acceso docente/estudiante: misReservas() + crear() (con límite)
 */
@Injectable({ providedIn: 'root' })
export class ReservaService {
  private base = `${environment.apiUrl}${environment.endpoints.reservas.listar}`;

  constructor(private http: HttpClient) {}

  listar(filtros?: { estado?: string; usuarioId?: string; libroId?: string }): Observable<any> {
    let params = new HttpParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }
    return this.http.get(this.base, { params });
  }

  obtener(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}`);
  }

  /** Reservas del usuario autenticado (todos los roles) */
  misReservas(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.reservas.misReservas}`,
    );
  }

  /**
   * Crear reserva — máximo 3 activas por usuario.
   * El backend rechaza con 409 si se excede el límite.
   */
  crear(data: { libroId: string; fechaExpiracion?: string }): Observable<any> {
    return this.http.post(this.base, data);
  }

  actualizar(id: string, data: { estado?: 'pendiente' | 'activa' | 'cancelada' | 'completada' }): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data);
  }

  /** Cancelar reserva (alias semántico de eliminar) */
  cancelar(id: string): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}${environment.endpoints.reservas.cancelar}/${id}`,
    );
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
