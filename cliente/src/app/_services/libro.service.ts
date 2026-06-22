import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio para el módulo Libros.
 * Prefijo: /api/libros
 * Lectura: público | Escritura: admin, bibliotecario
 *
 * Incluye búsqueda con IA vía el backend (DeepSeek + Full Text Search).
 * La búsqueda se integra en listar() mediante el query param `buscar`.
 */
@Injectable({ providedIn: 'root' })
export class LibroService {
  private base = `${environment.apiUrl}${environment.endpoints.libros.listar}`;

  constructor(private http: HttpClient) {}

  /**
   * Listar libros con filtros opcionales.
   * Query params soportados: titulo, isbn, editorialId, autorId,
   * categoriaId, publicado, anioPublicacion, buscar (IA)
   */
  listar(filtros?: {
    titulo?: string;
    isbn?: string;
    editorialId?: string;
    autorId?: string;
    categoriaId?: string;
    publicado?: boolean;
    anioPublicacion?: number;
    buscar?: string;
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

  /** Obtener libro completo (incluye autores, categorías, editorial, ejemplares, recursos digitales) */
  obtener(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}`);
  }

  crear(data: {
    titulo: string;
    isbn: string;
    editorialId: string;
    anioPublicacion?: number;
    idioma?: string;
    publicado?: boolean;
    descripcion?: string;
    autorIds?: string[];
    categoriaIds?: string[];
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
