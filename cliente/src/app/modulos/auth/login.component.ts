import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { StorageService } from '../../_services/storage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TarjetaComponent } from '../../_shared/componentes/datos/tarjeta.component';
import { EntradaComponent } from '../../_shared/componentes/entradas/entrada.component';
import { EntradaPasswordComponent } from '../../_shared/componentes/entradas/entrada-password.component';
import { BotonComponent } from '../../_shared/componentes/botones/boton.component';
import { AlertaComponent } from '../../_shared/componentes/retroalimentacion/alerta.component';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, CommonModule, TarjetaComponent, EntradaComponent, EntradaPasswordComponent, BotonComponent, AlertaComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <app-tarjeta titulo="Iniciar Sesión" class="w-full max-w-md">
        <div class="flex justify-center mb-4">
          <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400">&#128247;</div>
        </div>
        @if (isLoggedIn) {
          <div class="flex flex-col items-center gap-4 py-4">
            <svg class="w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <p class="text-lg font-semibold">Sesión iniciada</p>
            <p class="text-sm text-gray-500">{{ storageService.getNombre() }}</p>
          </div>
        }
        @if (!isLoggedIn) {
          <form name="form" (ngSubmit)="f.form.valid && onSubmit()" #f="ngForm" novalidate class="flex flex-col gap-4">
            <app-entrada etiqueta="Correo electrónico" id="correo" tipo="email" placeholder="tu@correo.com" [valor]="form.correo" (valorCambio)="form.correo = $event" [error]="f.submitted && correo.errors ? (correo.errors['required'] ? 'El correo es obligatorio' : correo.errors['email'] ? 'Debe ser un correo válido' : '') : ''" [requerido]="true" />
            <input type="hidden" name="correo" [ngModel]="form.correo" required email #correo="ngModel" />
            <app-entrada-password etiqueta="Contraseña" id="password" placeholder="Tu contraseña" [valor]="form.password" (valorCambio)="form.password = $event" [error]="f.submitted && password.errors?.['required'] ? 'La contraseña es obligatoria' : ''" [requerido]="true" />
            <input type="hidden" name="password" [ngModel]="form.password" required #password="ngModel" />
            <app-boton etiqueta="Iniciar Sesión" [cargando]="loading" [anchoCompleto]="true" icono='<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>' />
            @if (f.submitted && isLoginFailed) { <app-alerta [mensaje]="errorMessage || 'Error al iniciar sesión'" tipo="error" /> }
            <p class="text-center text-sm text-gray-500">¿No tienes cuenta? <a routerLink="/register" class="text-blue-600 font-semibold no-underline hover:underline">Regístrate</a></p>
          </form>
        }
      </app-tarjeta>
    </div>
  `,
  styles: `.no-underline { text-decoration: none; }`,
})
export class LoginComponent implements OnInit {
  form: any = { correo: null, password: null };
  isLoggedIn = false; isLoginFailed = false; errorMessage = ''; loading = false;
  constructor(private authService: AuthService, public storageService: StorageService) {}
  ngOnInit(): void { if (this.storageService.isLoggedIn()) this.isLoggedIn = true; }
  onSubmit(): void {
    if (this.loading) return; this.loading = true; this.isLoginFailed = false;
    const { correo, password } = this.form;
    this.authService.login(correo, password).subscribe({
      next: (data) => { this.storageService.saveUser(data.data ?? data); this.isLoggedIn = true; this.reloadPage(); },
      error: (err) => {
        const msg = err.error?.message ?? err.error?.mensaje ?? '';
        this.errorMessage = Array.isArray(msg) ? msg.join('. ') : msg;
        this.isLoginFailed = true; this.loading = false;
      },
    });
  }
  reloadPage(): void { window.location.reload(); }
}
