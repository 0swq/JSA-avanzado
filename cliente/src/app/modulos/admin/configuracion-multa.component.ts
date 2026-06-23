import {Component, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {EntradaNumeroComponent} from '../../_shared/componentes/entradas/entrada-numero.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {ConfiguracionMulta} from '../../model';

@Component({
  selector: 'app-configuracion-multa',
  standalone: true,
  imports: [
    SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    TarjetaComponent, BotonComponent, BotonContornoComponent,
    TextoPequenoComponent, TextTituloComponent,
    EntradaNumeroComponent, AlertaComponent,
    FormsModule, DatePipe,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-6 py-6 max-w-3xl w-full mx-auto">

          <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6">
            <app-pila-vertical espacio="1">
              <texto-titulo tamanio="xl">Configuración de Multas</texto-titulo>
              <texto-pequeno>Define la tarifa diaria y los días máximos de préstamo.</texto-pequeno>
            </app-pila-vertical>
          </app-pila-horizontal>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div class="bg-white rounded-xl border border-stone-200 p-4">
              <texto-pequeno color="gris">Configuración vigente</texto-pequeno>
              <p class="text-lg font-bold text-stone-800 mt-1">
                @if (configActual) {
                  {{ configActual.creadoEn | date: 'dd/MM/yyyy' }}
                } @else {
                  —
                }
              </p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-4">
              <texto-pequeno color="gris">Tarifa diaria actual</texto-pequeno>
              <p class="text-lg font-bold text-amber-600 mt-1">
                S/ {{ tarifaDiaria.toFixed(2) }}
              </p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-4">
              <texto-pequeno color="gris">Días máx. préstamo</texto-pequeno>
              <p class="text-lg font-bold text-stone-800 mt-1">
                {{ diasMaxPrestamo }} días
              </p>
            </div>
          </div>

          @if (exito) {
            <app-alerta tipo="exito" mensaje="Configuración actualizada correctamente."/>
          }

          @if (error) {
            <app-alerta tipo="error" [mensaje]="error"/>
          }
          <app-tarjeta titulo="Modificar configuración">
            <app-pila-vertical espacio="5">
              <app-entrada-numero
                etiqueta="Tarifa diaria (S/)"
                id="tarifa-diaria"
                [min]="0.50"
                [max]="100"
                [paso]="0.50"
                [valor]="tarifaDiaria"
                (valorCambio)="tarifaDiaria = $event"/>

              <div class="flex flex-col gap-1">
                <label for="dias-max" class="text-sm font-medium text-gray-700">
                  Días máximos de préstamo
                </label>
                <div class="flex items-center">
                  <button type="button"
                    class="px-3 py-2 border border-gray-300 rounded-l-lg text-gray-600 hover:bg-gray-50
                           transition-colors disabled:opacity-30 disabled:cursor-not-allowed select-none"
                    (click)="diasMaxPrestamo = diasMaxPrestamo - 1"
                    [disabled]="diasMaxPrestamo <= 3">−</button>
                  <input
                    id="dias-max"
                    type="number"
                    [(ngModel)]="diasMaxPrestamo"
                    [min]="3"
                    [max]="60"
                    class="w-24 text-center py-2 border-y border-gray-300 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-inset
                           disabled:bg-gray-100 disabled:cursor-not-allowed
                           [-moz-appearance:textfield]
                           [&::-webkit-inner-spin-button]:appearance-none
                           [&::-webkit-outer-spin-button]:appearance-none"/>
                  <button type="button"
                    class="px-3 py-2 border border-gray-300 rounded-r-lg text-gray-600 hover:bg-gray-50
                           transition-colors disabled:opacity-30 disabled:cursor-not-allowed select-none"
                    (click)="diasMaxPrestamo = diasMaxPrestamo + 1"
                    [disabled]="diasMaxPrestamo >= 60">+</button>
                </div>
              </div>

              <div class="bg-stone-50 rounded-lg border border-stone-200 p-4">
                <div class="flex flex-col gap-2">
                  <span class="text-sm font-medium text-stone-700">Resumen del ejemplo</span>
                  <div class="flex justify-between text-sm text-stone-600">
                    <span>Préstamo de 1 libro</span>
                    <span>{{ diasMaxPrestamo }} días máximo</span>
                  </div>
                  <div class="flex justify-between text-sm text-stone-600">
                    <span>Si se devuelve con 5 días de retraso</span>
                    <span class="text-red-600 font-medium">Multa: S/ {{ (5 * tarifaDiaria).toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-stone-600">
                    <span>Si se devuelve con 15 días de retraso</span>
                    <span class="text-red-600 font-medium">Multa: S/ {{ (15 * tarifaDiaria).toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <app-pila-horizontal espacio="4">
                <app-boton
                  etiqueta="Guardar Cambios"
                  tamanio="md"
                  [deshabilitado]="!cambiosPendientes"
                  (presionado)="guardarConfiguracion()"/>
                <app-boton-contorno
                  etiqueta="Restablecer"
                  tamanio="md"
                  [deshabilitado]="!cambiosPendientes"
                  (presionado)="restablecer()"/>
              </app-pila-horizontal>
            </app-pila-vertical>
          </app-tarjeta>
        </div>
      </main>
    </div>
  `,
})
export class ConfiguracionMultaComponent {
  tarifaDiaria: number = 2.50;
  diasMaxPrestamo: number = 7;

  exito: boolean = false;
  error: string = '';
  get configActual(): ConfiguracionMulta | undefined {
    return this.historial[0];
  }
  get cambiosPendientes(): boolean {
    if (!this.configActual) return true;
    return (
      this.tarifaDiaria !== this.configActual.tarifaDiaria ||
      this.diasMaxPrestamo !== this.configActual.diasMaxPrestamo
    );
  }

  guardarConfiguracion(): void {}

  restablecer(): void {
    if (this.configActual) {
      this.tarifaDiaria = this.configActual.tarifaDiaria;
      this.diasMaxPrestamo = this.configActual.diasMaxPrestamo;
    }
    this.exito = false;
    this.error = '';
  }

  historial: ConfiguracionMulta[] = [
    {
      id: 'cfg-003',
      tarifaDiaria: 2.50,
      diasMaxPrestamo: 7,
      creadoEn: '2026-06-01T00:00:00Z',
    },
    {
      id: 'cfg-002',
      tarifaDiaria: 2.00,
      diasMaxPrestamo: 10,
      creadoEn: '2026-03-15T00:00:00Z',
    },
    {
      id: 'cfg-001',
      tarifaDiaria: 3.00,
      diasMaxPrestamo: 5,
      creadoEn: '2025-11-20T00:00:00Z',
    },
  ];
}
