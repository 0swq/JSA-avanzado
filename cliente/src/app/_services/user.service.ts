import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  listarUsuarios(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.usuarios.listar}`,
    );
  }

  obtenerUsuario(id: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}${environment.endpoints.usuarios.obtener}/${id}`,
    );
  }

  actualizarUsuario(id: string, data: any): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}${environment.endpoints.usuarios.actualizar}/${id}`,
      data,
    );
  }

  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}${environment.endpoints.usuarios.eliminar}/${id}`,
    );
  }
}
