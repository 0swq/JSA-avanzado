import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EjemplarService {
  private base = `${environment.apiUrl}${environment.endpoints.ejemplares.listar}`;

  constructor(private http: HttpClient) {}
  listar(filtros?: { estado?: string; libroId?: string }): Observable<any> {
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

  porLibro(libroId: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.ejemplares.porLibro}/${libroId}`,
    );
  }
  crear(data: {
    libroId: string;
    codigoBarras: string;
    estado?: 'disponible' | 'prestado' | 'perdido' | 'mantenimiento';
    ubicacion?: string;
  }): Observable<any> {
    return this.http.post(this.base, data);
  }

  actualizar(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
