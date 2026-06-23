import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class ResenaService {
  private base = `${environment.apiUrl}${environment.endpoints.resenas.listar}`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(this.base);
  }

  obtener(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}`);
  }

  /** Reseñas de un libro específico (público) */
  porLibro(libroId: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.resenas.porLibro}/${libroId}`,
    );
  }

  /** Reseñas del usuario autenticado */
  misResenas(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.resenas.misResenas}`,
    );
  }

  crear(data: { libroId: string; puntuacion: number; comentario?: string }): Observable<any> {
    return this.http.post(this.base, data);
  }

  /** Solo el autor puede editar su propia reseña */
  actualizar(id: string, data: { puntuacion?: number; comentario?: string }): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
