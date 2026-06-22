import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {StorageService} from '../../../_services/storage.service';
import {BotonComponent} from '../botones/boton.component';
import {BotonContornoComponent} from '../botones/boton-contorno.component';
import {AvatarComponent} from '../datos/avatar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, BotonComponent, BotonContornoComponent, AvatarComponent],
  template: `
    <nav class="bg-white border-b border-gray-200 px-4 py-2.5">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center gap-6">
          <a routerLink="/inicio" class="text-lg font-bold text-gray-800 no-underline">
            📚 Biblioteca JSA
          </a>
          <div class="flex items-center gap-4">
            @for (link of enlaces; track link.ruta) {
              <a [routerLink]="link.ruta"
                 class="text-sm text-gray-600 hover:text-gray-900 transition-colors no-underline font-medium">
                {{ link.etiqueta }}
              </a>
            }
          </div>
        </div>

        <div class="flex items-center gap-2">
          @if (!logueado) {
            <a routerLink="/login" class="no-underline">
              <app-boton-contorno etiqueta="Iniciar Sesión" tamanio="sm"/>
            </a>

          }
          @if (logueado) {
            <div class="flex items-center gap-3">
              <app-avatar [nombre]="storage.getNombre()" tamanio="sm"/>
              <span class="text-sm text-gray-700">
                {{ storage.getNombre() }}
                @if (storage.getRol()) {
                  <span class="text-xs text-gray-400 ml-1">({{ storage.getRol() }})</span>
                }
              </span>
              <app-boton-contorno etiqueta="Salir" tamanio="sm" (presionado)="onLogout()"/>
            </div>
          }
        </div>
      </div>
    </nav>
  `,
  styles: `.no-underline {
    text-decoration: none;
    color: inherit;
  }`,
})
export class HeaderComponent implements OnInit {
  @Output() logout = new EventEmitter<void>();

  enlaces = [
    {etiqueta: 'Inicio', ruta: '/inicio'},
    {etiqueta: 'Catálogo', ruta: '/catalogo'},
  ];

  constructor(public storage: StorageService) {
  }

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
