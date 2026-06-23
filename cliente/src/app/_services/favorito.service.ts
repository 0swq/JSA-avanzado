import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class FavoritoService {
  private base = `${environment.apiUrl}${environment.endpoints.favoritos.agregar}`;

  constructor(private http: HttpClient) {}

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

  agregar(data: { libroId: string }): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}${environment.endpoints.favoritos.agregar}`,
      data,
    );
  }
  eliminar(id: string): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}${environment.endpoints.favoritos.eliminar}/${id}`,
    );
  }
}
