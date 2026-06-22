import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Servicio para el módulo Configuración de Multa.
 * Prefijo: /api/configuracion-multa
 * Define tarifa diaria y días máximos de préstamo.
 * Lectura: admin, bibliotecario | Escritura: solo admin
 */
@Injectable({ providedIn: 'root' })
export class ConfiguracionMultaService {
  private base = `${environment.apiUrl}${environment.endpoints.configuracionMulta.listar}`;

  constructor(private http: HttpClient) {}

  /** Obtener la configuración actual */
  listar(): Observable<any> {
    return this.http.get(this.base);
  }

  obtener(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}`);
  }

  crear(data: { tarifaDiaria: number; diasMaxPrestamo: number }): Observable<any> {
    return this.http.post(this.base, data);
  }

  actualizar(id: string, data: { tarifaDiaria?: number; diasMaxPrestamo?: number }): Observable<any> {
    return this.http.patch(`${this.base}/${id}`, data);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
