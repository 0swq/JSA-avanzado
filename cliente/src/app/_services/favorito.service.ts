import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio para el módulo Favoritos.
 * Prefijo: /api/favoritos
 * Cada usuario puede marcar/desmarcar libros como favoritos.
 * No tiene endpoint de actualización (PATCH).
 * Unique: [usuarioId, libroId] — no se puede duplicar.
 */
@Injectable({ providedIn: 'root' })
export class FavoritoService {
  private base = `${environment.apiUrl}${environment.endpoints.favoritos.agregar}`;

  constructor(private http: HttpClient) {}

  /** Favoritos del usuario autenticado */
  misFavoritos(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.favoritos.misFavoritos}`,
    );
  }

  obtener(id: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.favoritos.obtener}/${id}`,
    );
  }

  /** Agregar libro a favoritos (unique: usuarioId + libroId) */
  agregar(data: { libroId: string }): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}${environment.endpoints.favoritos.agregar}`,
      data,
    );
  }

  /** Quitar libro de favoritos */
  eliminar(id: string): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}${environment.endpoints.favoritos.eliminar}/${id}`,
    );
  }
}
