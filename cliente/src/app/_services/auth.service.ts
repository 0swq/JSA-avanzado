import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private base = `${environment.apiUrl}${environment.endpoints.auth.login}`.replace('/login', '');
  constructor(private http: HttpClient) {}
  login(correo: string, password: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}${environment.endpoints.auth.login}`,
      { correo, password },
      httpOptions,
    );
  }
  register(
    nombre: string,
    apellidos: string,
    dni: string,
    correo: string,
    password: string,
    rolId?: string,
  ): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}${environment.endpoints.auth.registro}`,
      { nombre, apellidos, dni, correo, password, rolId },
      httpOptions,
    );
  }

  getProfile(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.auth.perfil}`,
    );
  }
  getUsuarioPorId(id: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/usuarios/nombre/${id}`,
    );
  }
}
