import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {DatePipe} from '@angular/common';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {InsigniaComponent} from '../../_shared/componentes/datos/insignia.component';
import {AvatarComponent} from '../../_shared/componentes/datos/avatar.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {NavigationService} from '../../_services/navigation-store';
import {Multa, Prestamo, Ejemplar, Usuario} from '../../model';

@Component({
  selector: 'app-detalle-multa',
  standalone: true,
  imports: [
    SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    TarjetaComponent, BotonComponent, BotonContornoComponent,
    TextoNormalComponent, TextoPequenoComponent, TextTituloComponent,
    InsigniaComponent, AvatarComponent,
    RouterModule, DatePipe,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-4 sm:px-6 py-6 max-w-4xl w-full mx-auto">

          <button
            type="button"
            (click)="volver()"
            class="text-sm text-stone-500 hover:text-stone-700 mb-4 inline-flex items-center gap-1">
            ← Volver a multas
          </button>

          <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6 flex-wrap w-full">
            <app-pila-vertical espacio="1" class="w-full">
              <texto-titulo tamanio="xl">Detalle de Multa</texto-titulo>
              <texto-pequeno>Información completa de la multa y sus entidades relacionadas.</texto-pequeno>
            </app-pila-vertical>
          </app-pila-horizontal>

          @if (!multa) {
            <div class="text-center py-16">
              <texto-normal>No se encontró la multa seleccionada.</texto-normal>
              <app-boton
                class="mt-4"
                etiqueta="Ir a multas"
                tamanio="sm"
                (presionado)="volver()"/>
            </div>
          } @else {
            <app-pila-vertical espacio="6" class="w-full">

              <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="flex-col sm:flex-row !items-start sm:!items-center w-full">
                <app-pila-horizontal espacio="3" alinear="centro" class="w-full sm:w-auto">
                  @switch (multa.estado) {
                    @case ('pendiente') {
                      <app-insignia etiqueta="Pendiente" color="amber"/>
                    }
                    @case ('pagada') {
                      <app-insignia etiqueta="Pagada" color="green"/>
                    }
                    @case ('perdonada') {
                      <app-insignia etiqueta="Perdonada" color="blue"/>
                    }
                  }
                  <span class="text-xs font-mono text-stone-400">{{ multa.id }}</span>
                </app-pila-horizontal>

                @if (multa.estado === 'pendiente') {
                  <app-pila-horizontal espacio="3" class="w-full sm:w-auto">
                    <app-boton
                      class="w-full sm:w-auto"
                      etiqueta="Registrar Pago"
                      tamanio="sm"
                      (presionado)="registrarPago()"/>
                    <app-boton-contorno
                      class="w-full sm:w-auto"
                      etiqueta="Perdonar"
                      tamanio="sm"
                      (presionado)="perdonarMulta()"/>
                  </app-pila-horizontal>
                }
              </app-pila-horizontal>

              <app-tarjeta titulo="Datos de la multa" class="w-full">
                <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
                  <div class="w-full">
                    <texto-pequeno color="gris">Monto</texto-pequeno>
                    <p class="text-xl font-bold text-red-600">S/ {{ multa.monto.toFixed(2) }}</p>
                  </div>
                  <div class="w-full">
                    <texto-pequeno color="gris">Días de mora</texto-pequeno>
                    <p class="text-xl font-bold text-stone-800">{{ multa.diasMora }}</p>
                  </div>
                  <div class="w-full">
                    <texto-pequeno color="gris">Tarifa diaria</texto-pequeno>
                    <p class="text-xl font-bold text-amber-600">
                      S/ {{ (multa.monto / multa.diasMora).toFixed(2) }}
                    </p>
                  </div>
                  <div class="w-full">
                    <texto-pequeno color="gris">Creada</texto-pequeno>
                    <p class="text-sm font-medium text-stone-700 mt-1">
                      {{ multa.creadoEn | date: 'dd/MM/yyyy' }}
                    </p>
                  </div>
                </div>
              </app-tarjeta>

              @if (libro) {
                <app-tarjeta titulo="Libro" class="w-full">
                  <div class="flex flex-col sm:flex-row items-start gap-4 w-full">
                    <div class="aspect-[9/16] w-16 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center text-gray-400">
                      @if (libro.foto) {
                        <img [alt]="libro.titulo" [src]="libro.foto" class="w-full h-full object-cover"/>
                      } @else {
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                        </svg>
                      }
                    </div>
                    <div class="flex flex-col gap-1 w-full flex-1">
                      <p class="font-semibold text-stone-800">{{ libro.titulo }}</p>
                      <texto-pequeno>{{ libro.autores.join(', ') }}</texto-pequeno>
                      <texto-pequeno>{{ libro.editorial }} · {{ libro.anioPublicacion }} · ISBN {{ libro.isbn }}</texto-pequeno>
                      <div class="flex flex-wrap gap-1 mt-1">
                        @for (cat of libro.categorias; track cat) {
                          <span class="px-2 py-0.5 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                            {{ cat }}
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                </app-tarjeta>
              }

              @if (ejemplar) {
                <app-tarjeta titulo="Ejemplar" class="w-full">
                  <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
                    <div class="w-full">
                      <texto-pequeno color="gris">Código de barras</texto-pequeno>
                      <p class="font-semibold font-mono text-stone-800">{{ ejemplar.codigoBarras }}</p>
                    </div>
                    <div class="w-full">
                      <texto-pequeno color="gris">Ubicación</texto-pequeno>
                      <p class="font-semibold text-stone-800">{{ ejemplar.ubicacion || '—' }}</p>
                    </div>
                    <div class="w-full">
                      <texto-pequeno color="gris">Estado</texto-pequeno>
                      <app-insignia
                        [etiqueta]="ejemplar.estado"
                        [color]="ejemplar.estado === 'disponible' ? 'green' : ejemplar.estado === 'prestado' ? 'amber' : 'red'"
                        variante="sutil"/>
                    </div>
                    <div class="w-full">
                      <texto-pequeno color="gris">Adquirido</texto-pequeno>
                      <p class="text-sm text-stone-700 mt-1">{{ ejemplar.fechaAdquisicion || '—' }}</p>
                    </div>
                  </div>
                </app-tarjeta>
              }

              @if (usuario) {
                <app-tarjeta titulo="Usuario" class="w-full">
                  <div class="flex flex-col sm:flex-row items-start gap-4 w-full">
                    <app-avatar [nombre]="usuario.nombre + ' ' + usuario.apellidos" tamanio="lg"/>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
                      <div class="w-full">
                        <texto-pequeno color="gris">Nombre completo</texto-pequeno>
                        <p class="font-semibold text-stone-800">{{ usuario.nombre }} {{ usuario.apellidos }}</p>
                      </div>
                      <div class="w-full">
                        <texto-pequeno color="gris">DNI</texto-pequeno>
                        <p class="font-mono text-stone-700">{{ usuario.dni || '—' }}</p>
                      </div>
                      <div class="w-full">
                        <texto-pequeno color="gris">Correo</texto-pequeno>
                        <p class="text-stone-700">{{ usuario.correo || '—' }}</p>
                      </div>
                    </div>
                  </div>
                </app-tarjeta>
              }

              @if (prestamo) {
                <app-tarjeta titulo="Préstamo" class="w-full">
                  <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
                    <div class="w-full">
                      <texto-pequeno color="gris">Fecha máx. devolución</texto-pequeno>
                      <p class="font-semibold text-stone-800">
                        {{ prestamo.fechaMaxDevolucion | date: 'dd/MM/yyyy' }}
                      </p>
                    </div>
                    <div class="w-full">
                      <texto-pequeno color="gris">Devuelto</texto-pequeno>
                      @if (prestamo.fechaDevolucion) {
                        <p class="font-semibold text-green-700">
                          {{ prestamo.fechaDevolucion | date: 'dd/MM/yyyy' }}
                        </p>
                      } @else {
                        <app-insignia etiqueta="No devuelto" color="red" variante="sutil"/>
                      }
                    </div>
                    <div class="w-full">
                      <texto-pequeno color="gris">Estado</texto-pequeno>
                      <app-insignia
                        [etiqueta]="prestamo.estado"
                        [color]="prestamo.estado === 'activo' ? 'amber' : prestamo.estado === 'devuelto' ? 'green' : 'red'"
                        variante="sutil"/>
                    </div>
                    <div class="w-full">
                      <texto-pequeno color="gris">Creado</texto-pequeno>
                      <p class="text-sm text-stone-700 mt-1">{{ prestamo.creadoEn | date: 'dd/MM/yyyy' }}</p>
                    </div>
                  </div>
                </app-tarjeta>
              }

            </app-pila-vertical>
          }
        </div>
      </main>
    </div>
  `,
})
export class DetalleMultaComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  multa: Multa | null = null;
  prestamo: Prestamo | null = null;
  ejemplar: Ejemplar | null = null;
  usuario: Usuario | null = null;
  libro: any = null;

  ngOnInit(): void {
    const idMulta = this.navigationService.store.getState().multaSeleccionadaId;
    if (idMulta) {
      this.cargarDetalle(idMulta);
    }
  }

  cargarDetalle(idMulta: string): void {
    this.multa = this.multasHardcoded.find(m => m.id === idMulta) ?? null;
    if (!this.multa) return;

    this.prestamo = this.prestamosHardcoded.find(p => p.id === this.multa!.prestamoId) ?? null;
    if (!this.prestamo) return;

    this.ejemplar = this.ejemplaresHardcoded.find(e => e.id === this.prestamo!.ejemplarId) ?? null;

    this.usuario = this.usuariosHardcoded.find(u => u.id === this.prestamo!.usuarioId) ?? null;

    if (this.ejemplar) {
      this.libro = this.librosHardcoded.find((l: any) => l.id === this.ejemplar!.libroId) ?? null;
    }
  }
  registrarPago(): void {}

  perdonarMulta(): void {}

  volver(): void {
    this.router.navigate(['/admin/multas']);
  }
  multasHardcoded: Multa[] = [
    {id: 'm-001', prestamoId: 'p-001', monto: 15.50, diasMora: 5, estado: 'pendiente', creadoEn: '2026-06-10T00:00:00Z'},
    {id: 'm-002', prestamoId: 'p-002', monto: 32.00, diasMora: 12, estado: 'pendiente', creadoEn: '2026-06-01T00:00:00Z'},
    {id: 'm-003', prestamoId: 'p-003', monto: 8.00, diasMora: 3, estado: 'pagada', creadoEn: '2026-05-20T00:00:00Z'},
  ];

  prestamosHardcoded: Prestamo[] = [
    {
      id: 'p-001', usuarioId: 'u-001', ejemplarId: 'e-101',
      fechaMaxDevolucion: '2026-06-05T00:00:00Z',
      fechaDevolucion: undefined,
      estado: 'vencido', creadoEn: '2026-05-28T00:00:00Z',
    },
    {
      id: 'p-002', usuarioId: 'u-002', ejemplarId: 'e-301',
      fechaMaxDevolucion: '2026-05-20T00:00:00Z',
      fechaDevolucion: undefined,
      estado: 'vencido', creadoEn: '2026-05-10T00:00:00Z',
    },
    {
      id: 'p-003', usuarioId: 'u-003', ejemplarId: 'e-103',
      fechaMaxDevolucion: '2026-05-17T00:00:00Z',
      fechaDevolucion: '2026-05-20T00:00:00Z',
      estado: 'devuelto', creadoEn: '2026-05-10T00:00:00Z',
    },
  ];

  ejemplaresHardcoded: Ejemplar[] = [
    {id: 'e-101', libroId: '8f1e2c10-1a2b-4c3d-9e8f-111111111111', codigoBarras: 'BC-CSA-001', estado: 'prestado', ubicacion: 'Estante A-03', fechaAdquisicion: '2024-01-15', creadoEn: '2024-01-15T00:00:00Z'},
    {id: 'e-103', libroId: '8f1e2c10-1a2b-4c3d-9e8f-111111111111', codigoBarras: 'BC-CSA-003', estado: 'prestado', ubicacion: 'Estante A-04', fechaAdquisicion: '2024-06-01', creadoEn: '2024-06-01T00:00:00Z'},
    {id: 'e-301', libroId: '8f1e2c10-1a2b-4c3d-9e8f-333333333333', codigoBarras: 'BC-DQJ-001', estado: 'prestado', ubicacion: 'Estante B-01', fechaAdquisicion: '2023-09-10', creadoEn: '2023-09-10T00:00:00Z'},
  ];

  usuariosHardcoded: Usuario[] = [
    {id: 'u-001', rolId: 'r-003', nombre: 'Carlos', apellidos: 'Gómez López', dni: '12345678', correo: 'carlos@correo.com', creadoEn: '2025-01-01T00:00:00Z'},
    {id: 'u-002', rolId: 'r-003', nombre: 'María', apellidos: 'Pérez Ríos', dni: '87654321', correo: 'maria@correo.com', creadoEn: '2025-02-01T00:00:00Z'},
    {id: 'u-003', rolId: 'r-004', nombre: 'Ana', apellidos: 'Torres Vega', dni: '11223344', correo: 'ana@correo.com', creadoEn: '2025-03-01T00:00:00Z'},
  ];

  librosHardcoded = [
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111111',
      titulo: 'Cien Años de Soledad',
      isbn: '978-0307474728', anioPublicacion: 1967, idioma: 'Español',
      editorial: 'Editorial Sudamericana',
      autores: ['Gabriel García Márquez'],
      categorias: ['Literatura', 'Realismo mágico'],
      foto: 'https://covers.openlibrary.org/b/isbn/9780307474728-M.jpg',
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-333333333333',
      titulo: 'Don Quijote de la Mancha',
      isbn: '978-8420412146', anioPublicacion: 1605, idioma: 'Español',
      editorial: 'Editorial Cátedra',
      autores: ['Miguel de Cervantes'],
      categorias: ['Literatura', 'Clásicos'],
      foto: 'https://covers.openlibrary.org/b/isbn/9788420412146-M.jpg',
    },
  ];
}
