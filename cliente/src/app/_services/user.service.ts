import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio de usuario y contenido.
 *
 * 📦 Los métodos getPublicContent / getUserBoard / getModeratorBoard /
 *    getAdminBoard son del template legacy y apuntan a /api/test/*
 *    (endpoints que NO existen en el backend actual).
 *
 * ✅ Los métodos con nombre real (listarUsuarios, obtenerUsuario, etc.)
 *    apuntan a módulos reales del backend Express + Prisma.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // ──────────────────────────────────────────────
  // Legacy — endpoints de prueba del template
  // 📦 Estos endpoints NO existen en el backend.
  // ──────────────────────────────────────────────

  getPublicContent(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.test.all}`,
      { responseType: 'text' },
    );
  }

  getUserBoard(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.test.user}`,
      { responseType: 'text' },
    );
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.test.mod}`,
      { responseType: 'text' },
    );
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.test.admin}`,
      { responseType: 'text' },
    );
  }

  // ──────────────────────────────────────────────
  // Reales — módulo usuarios del backend
  // ──────────────────────────────────────────────

  /** GET /api/usuarios — listar todos (admin, bibliotecario) */
  listarUsuarios(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.usuarios.listar}`,
    );
  }

  /** GET /api/usuarios/:id — obtener por ID (admin, bibliotecario) */
  obtenerUsuario(id: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.usuarios.obtener}/${id}`,
    );
  }

  /** PATCH /api/usuarios/:id — actualizar (admin) */
  actualizarUsuario(id: string, data: any): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}${environment.endpoints.usuarios.actualizar}/${id}`,
      data,
    );
  }

  /** DELETE /api/usuarios/:id — eliminar (admin) */
  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}${environment.endpoints.usuarios.eliminar}/${id}`,
    );
  }
}
