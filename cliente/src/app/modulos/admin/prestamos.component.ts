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
import {Prestamo} from '../../model';

@Component({
  selector: 'app-admin-prestamos',
  standalone: true,
  imports: [
    SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    BotonIconoComponent, TextoPequenoComponent, TextTituloComponent, EntradaBusquedaComponent,
    SelectorComponent, InsigniaComponent, PaginacionComponent,
    FormsModule, RouterModule, DatePipe, BotonComponent,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">

          <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6 flex-wrap">
            <app-pila-vertical espacio="1">
              <texto-titulo tamanio="xl">Préstamos</texto-titulo>
              <texto-pequeno>Administra los préstamos activos, vencidos y devueltos.</texto-pequeno>
            </app-pila-vertical>
          </app-pila-horizontal>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
              <texto-pequeno color="gris">Total</texto-pequeno>
              <p class="text-xl sm:text-2xl font-bold text-stone-800 mt-1">{{ prestamos.length }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
              <texto-pequeno color="gris">Activos</texto-pequeno>
              <p class="text-xl sm:text-2xl font-bold text-green-600 mt-1">{{ activos }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
              <texto-pequeno color="gris">Vencidos</texto-pequeno>
              <p class="text-xl sm:text-2xl font-bold text-red-600 mt-1">{{ vencidos }}</p>
            </div>
            <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4">
              <texto-pequeno color="gris">Devueltos</texto-pequeno>
              <p class="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{{ devueltos }}</p>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-stone-200 p-3 sm:p-4 mb-6">
            <app-pila-horizontal espacio="4" alinear="fin" envolver="si">
              <div class="relative flex-1 min-w-[200px]">
                <app-entrada-busqueda
                  class="block pointer-events-none opacity-60 select-none"
                  placeholder="Codigo de barras"
                  [valor]="terminoBusqueda"
                  (valorCambio)="onBusquedaCambio($event)"/>
              </div>
              <app-boton etiqueta="Devolver libro"/><div class="relative flex-1 min-w-[200px]">
              <app-entrada-busqueda
                class="block pointer-events-none opacity-60 select-none"
                placeholder="Codigo de barras"
                [valor]="terminoBusqueda"
                (valorCambio)="onBusquedaCambio($event)"/>
            </div>
              <app-selector
                etiqueta="Estado"
                id="filtro-estado"
                [opciones]="opcionesEstado"
                [valor]="filtroEstado"
                (valorCambio)="onFiltroEstadoCambio($event)"
                placeholder="Todos"/>
            </app-pila-horizontal>
          </div>

          <div class="bg-white rounded-xl border border-stone-200 overflow-hidden w-full">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                <tr class="border-b border-stone-200 bg-stone-50">
                  <th
                    class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    ID
                  </th>
                  <th
                    class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Usuario
                  </th>
                  <th
                    class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Libro
                  </th>
                  <th
                    class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Préstamo
                  </th>
                  <th
                    class="text-left px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Máx. Devolución
                  </th>
                  <th
                    class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Estado
                  </th>
                  <th
                    class="text-center px-3 sm:px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                  @for (prestamo of prestamosPaginados; track prestamo.id) {
                    <tr class="hover:bg-amber-50/30 transition-colors">
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-xs font-mono text-stone-400">{{ prestamo.id.slice(0, 8) }}</span>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-sm font-medium text-stone-800">
                          {{ obtenerUsuario(prestamo)?.nombre }} {{ obtenerUsuario(prestamo)?.apellidos?.charAt(0) }}.
                        </span>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <span class="text-sm text-stone-700">{{ obtenerTituloLibro(prestamo) }}</span>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <texto-pequeno>{{ prestamo.creadoEn | date: 'dd/MM/yyyy' }}</texto-pequeno>
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <texto-pequeno>{{ prestamo.fechaMaxDevolucion | date: 'dd/MM/yyyy' }}</texto-pequeno>
                      </td>
                      <td class="px-3 sm:px-5 py-3 text-center">
                        @switch (prestamo.estado) {
                          @case ('activo') {
                            <app-insignia etiqueta="Activo" color="green" variante="sutil"/>
                          }
                          @case ('vencido') {
                            <app-insignia etiqueta="Vencido" color="red" variante="sutil"/>
                          }
                          @case ('devuelto') {
                            <app-insignia etiqueta="Devuelto" color="blue" variante="sutil"/>
                          }
                        }
                      </td>
                      <td class="px-3 sm:px-5 py-3">
                        <app-pila-horizontal espacio="1" justificar="centro">
                          @if (prestamo.estado !== 'devuelto') {
                            <app-boton-icono
                              icono="<"
                              tamanio="sm"
                              tooltip="Devolver libro"
                              (presionado)="devolverLibro(prestamo)"/>
                          }

                        </app-pila-horizontal>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="px-5 py-12 text-center">
                        <texto-pequeno>No se encontraron préstamos con los filtros actuales.</texto-pequeno>
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
                [total]="prestamosFiltrados.length"
                [tamanioPagina]="tamanioPagina"
                (cambioPagina)="irAPagina($event)"/>
            </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class AdminPrestamosComponent {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  terminoBusqueda: string = '';
  filtroEstado: string = '';

  opcionesEstado: Array<{ etiqueta: string; valor: string }> = [
    {etiqueta: 'Activo', valor: 'activo'},
    {etiqueta: 'Vencido', valor: 'vencido'},
    {etiqueta: 'Devuelto', valor: 'devuelto'},
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
    return Math.max(1, Math.ceil(this.prestamosFiltrados.length / this.tamanioPagina));
  }

  get prestamosPaginados(): Prestamo[] {
    const ini = (this.paginaActual - 1) * this.tamanioPagina;
    return this.prestamosFiltrados.slice(ini, ini + this.tamanioPagina);
  }

  irAPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas) this.paginaActual = p;
  }

  get prestamosFiltrados(): Prestamo[] {
    let r = this.prestamos;
    const t = this.terminoBusqueda.trim().toLowerCase();
    if (t) {
      r = r.filter(p => {
        const u = this.usuariosHardcoded.find(u => u.id === p.usuarioId);
        const lib = this.obtenerTituloLibro(p).toLowerCase();
        const nombre = (u?.nombre + ' ' + u?.apellidos).toLowerCase();
        return nombre.includes(t) || lib.includes(t);
      });
    }
    if (this.filtroEstado) {
      r = r.filter(p => p.estado === this.filtroEstado);
    }
    return r;
  }

  get activos(): number {
    return this.prestamos.filter(p => p.estado === 'activo').length;
  }

  get vencidos(): number {
    return this.prestamos.filter(p => p.estado === 'vencido').length;
  }

  get devueltos(): number {
    return this.prestamos.filter(p => p.estado === 'devuelto').length;
  }

  devolverLibro(prestamo: Prestamo): void {
    this.navigationService.store.getState().seleccionarPrestamo(prestamo.id);
    this.router.navigate(['/admin/prestamos/devolver']);
  }

  verDetalle(prestamo: Prestamo): void {
    this.navigationService.store.getState().seleccionarPrestamo(prestamo.id);
  }

  obtenerUsuario(prestamo: Prestamo): any {
    return this.usuariosHardcoded.find(u => u.id === prestamo.usuarioId);
  }

  obtenerTituloLibro(prestamo: Prestamo): string {
    const ej = this.ejemplaresHardcoded.find(e => e.id === prestamo.ejemplarId);
    if (!ej) return '—';
    const lib = this.librosHardcoded.find((l: any) => l.id === ej.libroId);
    return lib?.titulo ?? '—';
  }

  prestamos: Prestamo[] = [
    {
      id: 'p-001',
      usuarioId: 'u-001',
      ejemplarId: 'e-101',
      fechaMaxDevolucion: '2026-06-05T00:00:00Z',
      estado: 'vencido',
      creadoEn: '2026-05-28T00:00:00Z'
    },
    {
      id: 'p-002',
      usuarioId: 'u-002',
      ejemplarId: 'e-301',
      fechaMaxDevolucion: '2026-06-28T00:00:00Z',
      estado: 'activo',
      creadoEn: '2026-06-20T00:00:00Z'
    },
    {
      id: 'p-003',
      usuarioId: 'u-003',
      ejemplarId: 'e-103',
      fechaMaxDevolucion: '2026-05-17T00:00:00Z',
      fechaDevolucion: '2026-05-20T00:00:00Z',
      estado: 'devuelto',
      creadoEn: '2026-05-10T00:00:00Z'
    },
    {
      id: 'p-004',
      usuarioId: 'u-001',
      ejemplarId: 'e-501',
      fechaMaxDevolucion: '2026-06-30T00:00:00Z',
      estado: 'activo',
      creadoEn: '2026-06-22T00:00:00Z'
    },
    {
      id: 'p-005',
      usuarioId: 'u-002',
      ejemplarId: 'e-401',
      fechaMaxDevolucion: '2026-06-10T00:00:00Z',
      estado: 'vencido',
      creadoEn: '2026-06-01T00:00:00Z'
    },
  ];

  usuariosHardcoded = [
    {id: 'u-001', nombre: 'Carlos', apellidos: 'Gómez', correo: 'carlos@correo.com'},
    {id: 'u-002', nombre: 'María', apellidos: 'Pérez', correo: 'maria@correo.com'},
    {id: 'u-003', nombre: 'Ana', apellidos: 'Torres', correo: 'ana@correo.com'},
  ];

  ejemplaresHardcoded = [
    {id: 'e-101', libroId: '8f1e2c10-1a2b-4c3d-9e8f-111111111111'},
    {id: 'e-103', libroId: '8f1e2c10-1a2b-4c3d-9e8f-111111111111'},
    {id: 'e-301', libroId: '8f1e2c10-1a2b-4c3d-9e8f-333333333333'},
    {id: 'e-401', libroId: '8f1e2c10-1a2b-4c3d-9e8f-444444444444'},
    {id: 'e-501', libroId: '8f1e2c10-1a2b-4c3d-9e8f-555555555555'},
  ];

  librosHardcoded = [
    {id: '8f1e2c10-1a2b-4c3d-9e8f-111111111111', titulo: 'Cien Años de Soledad', autores: ['Gabriel García Márquez']},
    {id: '8f1e2c10-1a2b-4c3d-9e8f-333333333333', titulo: 'Don Quijote de la Mancha', autores: ['Miguel de Cervantes']},
    {id: '8f1e2c10-1a2b-4c3d-9e8f-444444444444', titulo: 'Breve Historia del Tiempo', autores: ['Stephen Hawking']},
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-555555555555',
      titulo: 'Introducción a los Algoritmos',
      autores: ['Cormen', 'Leiserson']
    },
  ];
}
