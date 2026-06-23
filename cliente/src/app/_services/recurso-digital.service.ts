import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class RecursoDigitalService {
  private base = `${environment.apiUrl}${environment.endpoints.recursosDigitales.listar}`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(this.base);
  }

  obtener(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}`);
  }

  porLibro(libroId: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.recursosDigitales.porLibro}/${libroId}`,
    );
  }

  crear(data: {
    libroId: string;
    tipo: 'pdf' | 'epub' | 'audiolibro' | 'video';
    url: string;
    acceso: 'publico' | 'autenticado' | 'restringido';
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
