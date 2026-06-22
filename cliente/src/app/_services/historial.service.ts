import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio para el módulo Historial (auditoría).
 * Prefijo: /api/historial
 * Solo tiene listar, obtener y crear — no se actualiza ni se elimina.
 * Acceso: admin, bibliotecario
 */
@Injectable({ providedIn: 'root' })
export class HistorialService {
  private base = `${environment.apiUrl}${environment.endpoints.historial.listar}`;

  constructor(private http: HttpClient) {}

  listar(filtros?: {
    hechoPorId?: string;
    modulo?: string;
    nombreAccion?: string;
    desde?: string;
    hasta?: string;
  }): Observable<any> {
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

  crear(data: { nombreAccion: string; accion: string; modulo: string; hechoPorId: string; ipUsuario?: string }): Observable<any> {
    return this.http.post(this.base, data);
  }
}
