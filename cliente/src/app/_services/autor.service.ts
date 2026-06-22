import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio para el módulo Autores.
 * Prefijo: /api/autores
 * Lectura: público | Escritura: admin, bibliotecario
 */
@Injectable({ providedIn: 'root' })
export class AutorService {
  private base = `${environment.apiUrl}${environment.endpoints.autores.listar}`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(this.base);
  }

  obtener(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}`);
  }

  crear(data: {
    nombre: string;
    apellidos: string;
    nacionalidad?: string;
    biografia?: string;
    fotoUrl?: string;
    fechaNacimiento?: string;
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
