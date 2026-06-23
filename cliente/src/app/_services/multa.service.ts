import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MultaService {
  private base = `${environment.apiUrl}${environment.endpoints.multas.listar}`;

  constructor(private http: HttpClient) {}

  listar(filtros?: { estado?: string; usuarioId?: string }): Observable<any> {
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

  /** Multas del usuario autenticado (todos los roles) */
  misMultas(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.multas.misMultas}`,
    );
  }

  crear(data: { prestamoId: string; monto: number; diasMora: number }): Observable<any> {
    return this.http.post(this.base, data);
  }

  actualizar(id: string, data: { estado?: 'pendiente' | 'pagada' | 'condonada'; monto?: number }): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
