import {Component, inject} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonIconoComponent} from '../../_shared/componentes/botones/boton-icono.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {EntradaBusquedaComponent} from '../../_shared/componentes/entradas/entrada-busqueda.component';
import {SelectorComponent} from '../../_shared/componentes/entradas/selector.component';
import {InsigniaComponent} from '../../_shared/componentes/datos/insignia.component';
import {PaginacionComponent} from '../../_shared/componentes/navegacion/paginacion.component';
import {NavigationService} from '../../_services/navigation-store';
import {Multa} from '../../model';

@Component({
  selector: 'app-admin-multas',
  standalone: true,
  imports: [
    SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent
    , BotonIconoComponent,
    TextoPequenoComponent, TextTituloComponent,
    SelectorComponent, InsigniaComponent, PaginacionComponent,
    FormsModule, RouterModule, DatePipe,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-6 py-6 max-w-7xl w-full mx-auto">

          <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6">
            <app-pila-vertical espacio="1">
              <texto-titulo tamanio="xl">Multas</texto-titulo>
              <texto-pequeno>Administra las multas generadas por préstamos vencidos.</texto-pequeno>
            </app-pila-vertical>
          </app-pila-horizontal>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-xl border border-stone-200 p-4">
              <texto-pequeno color="gris">Total multas</texto-pequeno>
              <p class="text-2xl font-bold text-stone-800 mt-1">{{ multas.length }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-4">
              <texto-pequeno color="gris">Pendientes</texto-pequeno>
              <p class="text-2xl font-bold text-amber-600 mt-1">{{ pendientes }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-4">
              <texto-pequeno color="gris">Pagadas</texto-pequeno>
              <p class="text-2xl font-bold text-green-600 mt-1">{{ pagadas }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-4">
              <texto-pequeno color="gris">Monto total pendiente</texto-pequeno>
              <p class="text-2xl font-bold text-red-600 mt-1">S/ {{ montoPendiente.toFixed(2) }}</p>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-stone-200 p-4 mb-6">
            <app-pila-horizontal espacio="4" alinear="fin" envolver="si">
              <app-selector
                etiqueta="Estado"
                id="filtro-estado"
                [opciones]="opcionesEstado"
                [valor]="filtroEstado"
                (valorCambio)="onFiltroEstadoCambio($event)"
                placeholder="Todos los estados"/>
            </app-pila-horizontal>
          </div>
          <div class="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                <tr class="border-b border-stone-200 bg-stone-50">
                  <th class="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">ID
                    Préstamo
                  </th>
                  <th class="text-right px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Monto
                  </th>
                  <th class="text-center px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Días
                    Mora
                  </th>
                  <th class="text-center px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Creado
                  </th>
                  <th class="text-center px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                  @for (multa of multasPaginadas; track multa.id) {
                    <tr class="hover:bg-amber-50/30 transition-colors">
                      <td class="px-5 py-3">
                        <span class="text-xs font-mono text-stone-500">{{ multa.prestamoId.slice(0, 8) }}...</span>
                      </td>

                      <td class="px-5 py-3 text-right">
                        <span class="text-sm font-semibold text-stone-800">S/ {{ multa.monto.toFixed(2) }}</span>
                      </td>
                      <td class="px-5 py-3 text-center">
                        <span class="text-xs text-stone-600">{{ multa.diasMora }} días</span>
                      </td>
                      <td class="px-5 py-3 text-center">
                        @switch (multa.estado) {
                          @case ('pendiente') {
                            <app-insignia etiqueta="Pendiente" color="amber" variante="sutil"/>
                          }
                          @case ('pagada') {
                            <app-insignia etiqueta="Pagada" color="green" variante="sutil"/>
                          }
                          @case ('perdonada') {
                            <app-insignia etiqueta="Perdonada" color="blue" variante="sutil"/>
                          }
                        }
                      </td>
                      <td class="px-5 py-3">
                        <texto-pequeno>{{ multa.creadoEn | date: 'dd/MM/yyyy' }}</texto-pequeno>
                      </td>
                      <td class="px-5 py-3">
                        <app-pila-horizontal espacio="1" justificar="centro">
                          @if (multa.estado === 'pendiente') {
                            <app-boton-icono
                              icono="S/."
                              tamanio="sm"
                              tooltip="Registrar pago"
                              (presionado)="registrarPago(multa)"/>
                            <app-boton-icono
                              icono="✓"
                              tamanio="sm"
                              tooltip="Perdonar"
                              (presionado)="perdonarMulta(multa)"/>
                          }
                          <app-boton-icono
                            icono="👁"
                            tamanio="sm"
                            tooltip="Ver detalle"
                            (presionado)="verDetalle(multa)"/>
                        </app-pila-horizontal>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="px-5 py-12 text-center">
                        <texto-pequeno>No se encontraron multas con los filtros actuales.</texto-pequeno>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          @if (totalPaginas > 1) {
            <div class="mt-6 flex justify-center">
              <app-paginacion
                [pagina]="paginaActual"
                [total]="multasFiltradas.length"
                [tamanioPagina]="tamanioPagina"
                (cambioPagina)="irAPagina($event)"/>
            </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class AdminMultasComponent {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  terminoBusqueda: string = '';
  filtroEstado: string = '';

  opcionesEstado: Array<{ etiqueta: string; valor: string }> = [
    {etiqueta: 'Pendiente', valor: 'pendiente'},
    {etiqueta: 'Pagada', valor: 'pagada'},
    {etiqueta: 'Perdonada', valor: 'perdonada'},
  ];

  onBusquedaCambio(valor: string): void {
    this.terminoBusqueda = valor;
    this.paginaActual = 1;
  }

  onFiltroEstadoCambio(valor: string): void {
    this.filtroEstado = valor;
    this.paginaActual = 1;
  }

  paginaActual: number = 1;
  tamanioPagina: number = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.multasFiltradas.length / this.tamanioPagina));
  }

  get multasPaginadas(): Multa[] {
    const inicio = (this.paginaActual - 1) * this.tamanioPagina;
    return this.multasFiltradas.slice(inicio, inicio + this.tamanioPagina);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get multasFiltradas(): Multa[] {
    let resultado = this.multas;
    const termino = this.terminoBusqueda.trim().toLowerCase();
    if (termino) {
      resultado = resultado.filter(m =>
        m.prestamoId.toLowerCase().includes(termino),
      );
    }
    if (this.filtroEstado) {
      resultado = resultado.filter(m => m.estado === this.filtroEstado);
    }
    return resultado;
  }

  get pendientes(): number {
    return this.multas.filter(m => m.estado === 'pendiente').length;
  }

  get pagadas(): number {
    return this.multas.filter(m => m.estado === 'pagada').length;
  }

  get montoPendiente(): number {
    return this.multas
      .filter(m => m.estado === 'pendiente')
      .reduce((sum, m) => sum + m.monto, 0);
  }

  registrarPago(multa: Multa): void {
    this.navigationService.store.getState().seleccionarMulta(multa.id);
    this.router.navigate(['/admin/pagos/registrar']);
  }

  perdonarMulta(multa: Multa): void {
    this.navigationService.store.getState().seleccionarMulta(multa.id);
  }

  verDetalle(multa: Multa): void {
    this.navigationService.store.getState().seleccionarMulta(multa.id);
    this.router.navigate(['/admin/multas/detalle']);
  }

  multas: Multa[] = [
    {
      id: 'm-001', prestamoId: 'p-8f1e2c10-1a2b-4c3d-9e8f-111111111111',
      monto: 15.50, diasMora: 5, estado: 'pendiente',
      creadoEn: '2026-06-10T00:00:00Z',
    },
    {
      id: 'm-002', prestamoId: 'p-8f1e2c10-1a2b-4c3d-9e8f-222222222222',
      monto: 32.00, diasMora: 12, estado: 'pendiente',
      creadoEn: '2026-06-01T00:00:00Z',
    },
    {
      id: 'm-003', prestamoId: 'p-8f1e2c10-1a2b-4c3d-9e8f-333333333333',
      monto: 8.00, diasMora: 3, estado: 'pagada',
      creadoEn: '2026-05-20T00:00:00Z',
    },
    {
      id: 'm-004', prestamoId: 'p-8f1e2c10-1a2b-4c3d-9e8f-444444444444',
      monto: 45.00, diasMora: 20, estado: 'pendiente',
      creadoEn: '2026-05-15T00:00:00Z',
    },
    {
      id: 'm-005', prestamoId: 'p-8f1e2c10-1a2b-4c3d-9e8f-555555555555',
      monto: 12.00, diasMora: 4, estado: 'pagada',
      creadoEn: '2026-04-28T00:00:00Z',
    },
    {
      id: 'm-006', prestamoId: 'p-8f1e2c10-1a2b-4c3d-9e8f-666666666666',
      monto: 60.00, diasMora: 30, estado: 'pendiente',
      creadoEn: '2026-04-10T00:00:00Z',
    },
    {
      id: 'm-007', prestamoId: 'p-8f1e2c10-1a2b-4c3d-9e8f-777777777777',
      monto: 5.50, diasMora: 2, estado: 'perdonada',
      creadoEn: '2026-04-01T00:00:00Z',
    },
    {
      id: 'm-008', prestamoId: 'p-8f1e2c10-1a2b-4c3d-9e8f-888888888888',
      monto: 22.00, diasMora: 8, estado: 'pendiente',
      creadoEn: '2026-06-18T00:00:00Z',
    },
    {
      id: 'm-009', prestamoId: 'p-8f1e2c10-1a2b-4c3d-9e8f-999999999999',
      monto: 18.00, diasMora: 6, estado: 'pagada',
      creadoEn: '2026-05-30T00:00:00Z',
    },
    {
      id: 'm-010', prestamoId: 'p-8f1e2c10-1a2b-4c3d-9e8f-aaaaaaaaaaaa',
      monto: 35.00, diasMora: 15, estado: 'pendiente',
      creadoEn: '2026-06-22T00:00:00Z',
    },
    {
      id: 'm-011', prestamoId: 'p-8f1e2c10-1a2b-4c3d-9e8f-bbbbbbbbbbbb',
      monto: 9.50, diasMora: 3, estado: 'pendiente',
      creadoEn: '2026-06-21T00:00:00Z',
    },
    {
      id: 'm-012', prestamoId: 'p-8f1e2c10-1a2b-4c3d-9e8f-cccccccccccc',
      monto: 55.00, diasMora: 25, estado: 'perdonada',
      creadoEn: '2026-03-15T00:00:00Z',
    },
  ];
}
