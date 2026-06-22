import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio para el módulo Categorías.
 * Prefijo: /api/categorias
 * Soporta jerarquía padre/hijas (campo padreId).
 * Lectura: público | Escritura: admin, bibliotecario
 */
@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private base = `${environment.apiUrl}${environment.endpoints.categorias.listar}`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(this.base);
  }

  obtener(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}`);
  }

  crear(data: { nombre: string; padreId?: string; activa?: boolean }): Observable<any> {
    return this.http.post(this.base, data);
  }

  actualizar(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
