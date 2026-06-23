import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class LibroService {
  private base = `${environment.apiUrl}${environment.endpoints.libros.listar}`;

  constructor(private http: HttpClient) {}

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
