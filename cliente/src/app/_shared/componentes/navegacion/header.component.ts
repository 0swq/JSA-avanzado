import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {StorageService} from '../../../_services/storage.service';
import {BotonContornoComponent} from '../botones/boton-contorno.component';
import {AvatarComponent} from '../datos/avatar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, BotonContornoComponent, AvatarComponent],
  template: `
    <nav class="bg-white border-b border-amber-100 shadow-sm px-4 py-3">
      <div class="flex items-center justify-between max-w-7xl mx-auto">

        <div class="flex items-center gap-8">
          <a routerLink="/inicio" class="flex items-center gap-2 no-underline">

            <span class="text-base font-bold text-stone-800 tracking-tight">Biblioteca JSA</span>
          </a>

          <div class="flex items-center gap-1">
            @for (link of enlaces; track link.ruta) {
              <a [routerLink]="link.ruta"
                 class="px-3 py-1.5 text-sm text-stone-600 hover:text-amber-700 hover:bg-amber-50
                        rounded-lg transition-all duration-200 no-underline font-medium">
                {{ link.etiqueta }}
              </a>
            }
          </div>
        </div>

        <div class="flex items-center gap-3">
          @if (!logueado) {
            <a routerLink="/login" class="no-underline">
              <app-boton-contorno etiqueta="Iniciar Sesión" tamanio="sm"/>
            </a>
          }
          @if (logueado) {
            <div class="flex items-center gap-3">

              <div class="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl">
                <app-avatar [nombre]="storage.getNombre()" tamanio="sm"/>
                <div class="flex flex-col leading-tight">
                  <span class="text-sm font-semibold text-stone-800">{{ storage.getNombre() }}</span>
                  @if (storage.getRol()) {
                    <span class="text-xs text-amber-700 font-medium">{{ storage.getRol() }}</span>
                  }
                </div>
              </div>
              <app-boton-contorno etiqueta="Salir" tamanio="sm" (presionado)="onLogout()"/>
            </div>
          }
        </div>

      </div>
    </nav>
  `,
  styles: `
    .no-underline {
      text-decoration: none;
      color: inherit;
    }
  `,
})
export class HeaderComponent implements OnInit {
  @Output() logout = new EventEmitter<void>();

  enlaces = [
    {etiqueta: 'Inicio',    ruta: '/inicio'},
    {etiqueta: 'Catálogo',  ruta: '/catalogo'},
    {etiqueta: 'Mis Préstamos', ruta: '/prestamos'},
    {etiqueta: 'Reservas',  ruta: '/reservas'},
  ];

  constructor(public storage: StorageService) {}

  get logueado(): boolean {
    return this.storage.isLoggedIn();
  }

  ngOnInit(): void {
    if (this.storage.isLoggedIn()) {
      this.storage.fetchPerfil();
    }
  }

  onLogout(): void {
    this.storage.clean();
    window.location.reload();
  }
}
