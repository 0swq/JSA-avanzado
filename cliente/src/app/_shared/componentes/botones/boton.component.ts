import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [type]="tipo" [disabled]="deshabilitado || cargando"
      class="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200
             focus:outline-none focus:ring-2 focus:ring-offset-1
             disabled:opacity-50 disabled:cursor-not-allowed select-none"
      [class]="clases" (click)="presionado.emit()">
      @if (cargando) {
        <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      }
      @if (!cargando && icono && posicionIcono === 'izquierda') { <span [innerHTML]="icono" class="w-4 h-4 inline-block"></span> }
      @if (etiqueta) { <span>{{ etiqueta }}</span> }
      @if (!cargando && icono && posicionIcono === 'derecha') { <span [innerHTML]="icono" class="w-4 h-4 inline-block"></span> }
      <ng-content />
    </button>
  `,
})
export class BotonComponent {
  @Input() etiqueta: string = '';
  @Input() icono: string = '';
  @Input() posicionIcono: string = 'izquierda';
  @Input() cargando: boolean = false;
  @Input() deshabilitado: boolean = false;
  @Input() tamanio: string = 'md';
  @Input() anchoCompleto: boolean = false;
  @Input() tipo: string = 'button';

  @Output() presionado = new EventEmitter<void>();

  get clases(): string {
    const tamanios: Record<string, string> = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
    return `bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 ${tamanios[this.tamanio] ?? 'px-4 py-2 text-sm'} ${this.anchoCompleto ? 'w-full' : ''}`;
  }
}
