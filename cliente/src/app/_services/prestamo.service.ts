import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio para el módulo Préstamos.
 * Prefijo: /api/prestamos
 * Estados: activo, devuelto, vencido
 * Acceso admin/bibliotecario: CRUD completo
 * Acceso docente/estudiante: solo misPrestamos()
 */
@Injectable({ providedIn: 'root' })
export class PrestamoService {
  private base = `${environment.apiUrl}${environment.endpoints.prestamos.listar}`;

  constructor(private http: HttpClient) {}

  listar(filtros?: { estado?: string; usuarioId?: string; ejemplarId?: string }): Observable<any> {
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

  /** Préstamos del usuario autenticado (todos los roles) */
  misPrestamos(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.prestamos.misPrestamos}`,
    );
  }

  crear(data: {
    usuarioId: string;
    ejemplarId: string;
    fechaMaxDevolucion: string;
  }): Observable<any> {
    return this.http.post(this.base, data);
  }

  /** Registrar devolución o cambiar estado (activo → devuelto/vencido) */
  actualizar(id: string, data: { estado?: 'activo' | 'devuelto' | 'vencido'; fechaDevolucion?: string }): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
