import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const USER_KEY = 'auth-user';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(private http: HttpClient) {}

  clean(): void { window.localStorage.clear(); }

  saveUser(user: any): void {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getUsuario(): any {
    const stored = this.getUser();
    if (!stored) return null;
    return stored?.usuario ?? stored?.data?.usuario ?? stored;
  }

  getNombre(): string {
    const u = this.getUsuario();
    return u?.nombre ?? u?.correo ?? '';
  }

  getRol(): string {
    const u = this.getUsuario();
    return u?.rol?.nombre ?? u?.rolId ?? '';
  }

  getId(): string {
    const u = this.getUsuario();
    return u?.id ?? '';
  }

  getToken(): string | null {
    const stored = this.getUser();
    if (!stored) return null;
    return stored?.token ?? stored?.data?.token ?? null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  /** Llama al API para refrescar los datos del perfil y los guarda en localStorage */
  fetchPerfil(): void {
    if (!this.isLoggedIn()) return;
    this.http.get(`${environment.apiUrl}${environment.endpoints.auth.perfil}`).subscribe({
      next: (res: any) => {
        const perfil = res?.data ?? res;
        this.saveUser({ ...this.getUser(), usuario: perfil });
      },
      error: () => { /* si falla, se queda con lo que hay en localStorage */ },
    });
  }
}
