import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PagoMultaService {
  private base = `${environment.apiUrl}${environment.endpoints.pagosMulta.listar}`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(this.base);
  }

  obtener(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}`);
  }

  porMulta(multaId: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.pagosMulta.porMulta}/${multaId}`,
    );
  }

  crear(data: {
    multaId: string;
    montoPagado: number;
    metodoPago: 'efectivo' | 'transferencia' | 'tarjeta';
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
