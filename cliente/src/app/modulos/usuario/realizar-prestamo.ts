import {Component, inject, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HeaderComponent} from '../../_shared/componentes/navegacion/header.component';
import {FooterComponent} from '../../_shared/componentes/navegacion/footer.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {SelectorComponent} from '../../_shared/componentes/entradas/selector.component';
import {EstadoVacioComponent} from '../../_shared/componentes/retroalimentacion/estado-vacio.component';
import {NavigationService} from '../../_services/navigation-store';
import {Prestamo, Ejemplar} from '../../model';

@Component({
  selector: 'app-realizar-prestamo',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TarjetaComponent, BotonComponent,
    BotonContornoComponent, TextoNormalComponent, TextoPequenoComponent, TextTituloComponent,
    PilaVerticalComponent, PilaHorizontalComponent, AlertaComponent, SelectorComponent,
    EstadoVacioComponent, FormsModule, DatePipe],
  template: `
    <div class="min-h-screen flex flex-col bg-amber-50/30">
      <app-header></app-header>

      <main class="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <button
          type="button"
          (click)="volver()"
          class="text-sm text-stone-500 hover:text-stone-700 mb-6 inline-flex items-center gap-1">
          ← Volver al libro
        </button>

        @if (libro) {
          <div class="flex flex-col gap-6">

            <texto-titulo>Realizar Préstamo</texto-titulo>
            <texto-normal>Selecciona un ejemplar disponible para realizar el préstamo.</texto-normal>

            <app-tarjeta titulo="Libro seleccionado">
              <div class="flex flex-col sm:flex-row gap-6">

                <div
                  class="aspect-[9/16] w-full sm:w-48 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center text-gray-400">
                  @if (libro.foto && !errorImagen) {
                    <img
                      [alt]="libro.titulo"
                      [src]="libro.foto"
                      (error)="errorImagen = true"
                      class="w-full h-full object-cover"/>
                  } @else {
                    <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                    </svg>
                  }
                </div>

                <div class="flex flex-col gap-3 flex-1">
                  <div>
                    <p class="font-semibold text-stone-800 text-lg">{{ libro.titulo }}</p>
                    <texto-pequeno>{{ libro.autores.join(', ') }}</texto-pequeno>
                  </div>

                  <texto-pequeno>{{ libro.editorial }} · {{ libro.anioPublicacion }}</texto-pequeno>

                  @if (ejemplaresDisponibles.length > 0) {
                    <span class="text-sm font-medium text-green-700">
                      {{ ejemplaresDisponibles.length }} ejemplar(es) disponible(s)
                    </span>
                  } @else {
                    <span class="text-sm font-medium text-red-600">Sin ejemplares disponibles</span>
                  }
                </div>
              </div>
            </app-tarjeta>

            @if (exito) {
              <app-alerta tipo="exito" mensaje="Préstamo registrado correctamente. Puedes verlo en Mis Préstamos."/>
            }

            @if (error) {
              <app-alerta tipo="error" [mensaje]="error"/>
            }

            @if (!exito) {
              <app-tarjeta titulo="Datos del préstamo">
                <div class="flex flex-col gap-6">

                  @if (ejemplaresDisponibles.length > 0) {
                    <app-selector
                      etiqueta="Ejemplar"
                      id="ejemplar"
                      [opciones]="opcionesEjemplares"
                      [valor]="ejemplarSeleccionadoId"
                      (valorCambio)="onEjemplarCambio($event)"
                      placeholder="Selecciona un ejemplar..."
                    />

                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-medium text-gray-700">Fecha máxima de devolución</span>
                      <span class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-stone-700">
                        {{ fechaMaxDevolucion | date: 'dd/MM/yyyy' }}
                        <span class="text-xs text-gray-400 ml-2">({{ diasPrestamo }} días de préstamo)</span>
                      </span>
                    </div>

                    @if (ejemplarSeleccionado) {
                      <div class="bg-stone-50 rounded-lg border border-stone-200 p-4">
                        <div class="flex flex-col gap-1">
                          <span class="text-sm font-medium text-stone-700">Resumen</span>
                          <div class="flex justify-between text-sm text-stone-600">
                            <span>Código de barras</span>
                            <span class="font-mono">{{ ejemplarSeleccionado.codigoBarras }}</span>
                          </div>
                          <div class="flex justify-between text-sm text-stone-600">
                            <span>Ubicación</span>
                            <span>{{ ejemplarSeleccionado.ubicacion }}</span>
                          </div>
                          <div class="flex justify-between text-sm text-stone-600">
                            <span>Préstamo hasta</span>
                            <span>{{ fechaMaxDevolucion | date: 'dd/MM/yyyy' }}</span>
                          </div>
                        </div>
                      </div>
                    }

                    <div class="flex flex-col sm:flex-row gap-4">
                      <app-boton
                        etiqueta="Confirmar Préstamo"
                        tamanio="md"
                        [anchoCompleto]="false"
                        [deshabilitado]="!formularioValido"
                        (presionado)="confirmarPrestamo()"/>
                      <app-boton-contorno
                        etiqueta="Cancelar"
                        tamanio="md"
                        [anchoCompleto]="false"
                        (presionado)="volver()"/>
                    </div>
                  } @else {
                    <app-estado-vacio
                      titulo="Sin ejemplares disponibles"
                      descripcion="Todos los ejemplares de este libro están prestados o en mantenimiento."/>
                    <app-boton
                      etiqueta="Volver al catálogo"
                      tamanio="sm"
                      (presionado)="volver()"/>
                  }
                </div>
              </app-tarjeta>
            }

          </div>
        } @else {
          <div class="text-center py-16">
            <texto-normal>No se encontró el libro para realizar el préstamo.</texto-normal>
            <app-boton
              class="mt-4"
              etiqueta="Ir al catálogo"
              tamanio="sm"
              (presionado)="volver()"/>
          </div>
        }
      </main>

      <app-footer/>
    </div>
  `,
})
export class RealizarPrestamoComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  errorImagen = false;
  exito = false;
  error: string = '';
  ejemplarSeleccionadoId: string = '';
  diasPrestamo: number = 7;

  ngOnInit(): void {
    const id = this.navigationService.store.getState().libroSeleccionadoId;
    void id;
  }

  get fechaMaxDevolucion(): Date {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + this.diasPrestamo);
    return fecha;
  }

  get formularioValido(): boolean {
    return !!this.ejemplarSeleccionadoId && !this.exito;
  }

  get opcionesEjemplares(): Array<{ etiqueta: string; valor: string }> {
    return this.ejemplaresDisponibles.map(e => ({
      etiqueta: `${e.codigoBarras} — ${e.ubicacion}`,
      valor: e.id,
    }));
  }

  get ejemplarSeleccionado(): Ejemplar | undefined {
    return this.ejemplaresDisponibles.find(e => e.id === this.ejemplarSeleccionadoId);
  }

  onEjemplarCambio(valor: string): void {
    this.ejemplarSeleccionadoId = valor;
  }

  confirmarPrestamo(): void {
    if (!this.libro || !this.ejemplarSeleccionado) {
      this.error = 'Debes seleccionar un ejemplar disponible.';
      return;
    }

    const nuevoPrestamo: Prestamo = {
      id: crypto.randomUUID(),
      usuarioId: 'usuario-actual',
      ejemplarId: this.ejemplarSeleccionado.id,
      fechaMaxDevolucion: this.fechaMaxDevolucion.toISOString(),
      estado: 'activo',
      creadoEn: new Date().toISOString(),
    };

    this.navigationService.store.getState().seleccionarPrestamo(nuevoPrestamo.id);

    const prestamosGuardados = JSON.parse(localStorage.getItem('prestamos') ?? '[]');
    prestamosGuardados.push(nuevoPrestamo);
    localStorage.setItem('prestamos', JSON.stringify(prestamosGuardados));

    this.exito = true;
    this.error = '';
  }

  volver(): void {
    const id = this.navigationService.store.getState().libroSeleccionadoId;
    this.router.navigate(['/catalogo', id]);
  }

  libros = [
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111111',
      titulo: 'Cien Años de Soledad',
      isbn: '978-0307474728',
      anioPublicacion: 1967,
      idioma: 'Español',
      descripcion: 'La historia de la familia Buendía a lo largo de varias generaciones en Macondo.',
      editorial: 'Editorial Sudamericana',
      autores: ['Gabriel García Márquez'],
      categorias: ['Literatura', 'Realismo mágico'],
      ejemplaresDisponibles: 3,
      ejemplaresTotal: 5,
      foto: 'https://covers.openlibrary.org/b/isbn/9780307474728-M.jpg',
      archivosDigitales: ['pdf', 'mp3'],
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-222222222222',
      titulo: 'Clean Code',
      isbn: '978-0132350884',
      anioPublicacion: 2008,
      idioma: 'Inglés',
      descripcion: 'Una guía de buenas prácticas para escribir código limpio y mantenible.',
      editorial: 'Prentice Hall',
      autores: ['Robert C. Martin'],
      categorias: ['Ingeniería de Software', 'Tecnología'],
      ejemplaresDisponibles: 0,
      ejemplaresTotal: 2,
      foto: 'https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg',
      archivosDigitales: ['pdf'],
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-333333333333',
      titulo: 'Don Quijote de la Mancha',
      isbn: '978-8420412146',
      anioPublicacion: 1605,
      idioma: 'Español',
      descripcion: 'Las aventuras de un hidalgo que enloquece leyendo novelas de caballería.',
      editorial: 'Editorial Cátedra',
      autores: ['Miguel de Cervantes'],
      categorias: ['Literatura', 'Clásicos'],
      ejemplaresDisponibles: 2,
      ejemplaresTotal: 4,
      foto: 'https://covers.openlibrary.org/b/isbn/9788420412146-M.jpg',
      archivosDigitales: ['pdf', 'mp3', 'mp4'],
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-444444444444',
      titulo: 'Breve Historia del Tiempo',
      isbn: '978-0553380163',
      anioPublicacion: 1988,
      idioma: 'Español',
      descripcion: 'Una introducción accesible a la cosmología y la física moderna.',
      editorial: 'Bantam Books',
      autores: ['Stephen Hawking'],
      categorias: ['Ciencia', 'Física'],
      ejemplaresDisponibles: 1,
      ejemplaresTotal: 3,
      foto: 'https://covers.openlibrary.org/b/isbn/9780553380163-M.jpg',
      archivosDigitales: ['pdf', 'mp4'],
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-555555555555',
      titulo: 'Introducción a los Algoritmos',
      isbn: '978-0262033848',
      anioPublicacion: 2009,
      idioma: 'Inglés',
      descripcion: 'Texto de referencia sobre algoritmos y estructuras de datos.',
      editorial: 'MIT Press',
      autores: ['Thomas H. Cormen', 'Charles E. Leiserson'],
      categorias: ['Ingeniería de Software', 'Matemáticas'],
      ejemplaresDisponibles: 4,
      ejemplaresTotal: 6,
      foto: 'https://covers.openlibrary.org/b/isbn/9780262033848-M.jpg',
      archivosDigitales: ['pdf'],
    },
  ];

  ejemplaresPorLibro: Record<string, Ejemplar[]> = {
    '8f1e2c10-1a2b-4c3d-9e8f-111111111111': [
      {
        id: 'e-101', libroId: '8f1e2c10-1a2b-4c3d-9e8f-111111111111',
        codigoBarras: 'BC-CSA-001', estado: 'disponible', ubicacion: 'Estante A-03',
        fechaAdquisicion: '2024-01-15', creadoEn: '2024-01-15T00:00:00Z',
      },
      {
        id: 'e-102', libroId: '8f1e2c10-1a2b-4c3d-9e8f-111111111111',
        codigoBarras: 'BC-CSA-002', estado: 'disponible', ubicacion: 'Estante A-03',
        fechaAdquisicion: '2024-01-15', creadoEn: '2024-01-15T00:00:00Z',
      },
      {
        id: 'e-103', libroId: '8f1e2c10-1a2b-4c3d-9e8f-111111111111',
        codigoBarras: 'BC-CSA-003', estado: 'disponible', ubicacion: 'Estante A-04',
        fechaAdquisicion: '2024-06-01', creadoEn: '2024-06-01T00:00:00Z',
      },
    ],
    '8f1e2c10-1a2b-4c3d-9e8f-222222222222': [],
    '8f1e2c10-1a2b-4c3d-9e8f-333333333333': [
      {
        id: 'e-301', libroId: '8f1e2c10-1a2b-4c3d-9e8f-333333333333',
        codigoBarras: 'BC-DQJ-001', estado: 'disponible', ubicacion: 'Estante B-01',
        fechaAdquisicion: '2023-09-10', creadoEn: '2023-09-10T00:00:00Z',
      },
      {
        id: 'e-302', libroId: '8f1e2c10-1a2b-4c3d-9e8f-333333333333',
        codigoBarras: 'BC-DQJ-002', estado: 'disponible', ubicacion: 'Estante B-01',
        fechaAdquisicion: '2023-09-10', creadoEn: '2023-09-10T00:00:00Z',
      },
    ],
    '8f1e2c10-1a2b-4c3d-9e8f-444444444444': [
      {
        id: 'e-401', libroId: '8f1e2c10-1a2b-4c3d-9e8f-444444444444',
        codigoBarras: 'BC-BHT-001', estado: 'disponible', ubicacion: 'Estante C-02',
        fechaAdquisicion: '2025-02-20', creadoEn: '2025-02-20T00:00:00Z',
      },
    ],
    '8f1e2c10-1a2b-4c3d-9e8f-555555555555': [
      {
        id: 'e-501', libroId: '8f1e2c10-1a2b-4c3d-9e8f-555555555555',
        codigoBarras: 'BC-ITP-001', estado: 'disponible', ubicacion: 'Estante C-05',
        fechaAdquisicion: '2024-11-01', creadoEn: '2024-11-01T00:00:00Z',
      },
      {
        id: 'e-502', libroId: '8f1e2c10-1a2b-4c3d-9e8f-555555555555',
        codigoBarras: 'BC-ITP-002', estado: 'disponible', ubicacion: 'Estante C-05',
        fechaAdquisicion: '2024-11-01', creadoEn: '2024-11-01T00:00:00Z',
      },
      {
        id: 'e-503', libroId: '8f1e2c10-1a2b-4c3d-9e8f-555555555555',
        codigoBarras: 'BC-ITP-003', estado: 'disponible', ubicacion: 'Estante C-06',
        fechaAdquisicion: '2025-01-10', creadoEn: '2025-01-10T00:00:00Z',
      },
      {
        id: 'e-504', libroId: '8f1e2c10-1a2b-4c3d-9e8f-555555555555',
        codigoBarras: 'BC-ITP-004', estado: 'disponible', ubicacion: 'Estante C-06',
        fechaAdquisicion: '2025-01-10', creadoEn: '2025-01-10T00:00:00Z',
      },
    ],
  };

  get ejemplaresDisponibles(): Ejemplar[] {
    if (!this.libro) return [];
    return (this.ejemplaresPorLibro[this.libro.id] ?? [])
      .filter(e => e.estado === 'disponible');
  }

  get libro() {
    const id = this.navigationService.store.getState().libroSeleccionadoId;
    return this.libros.find(l => l.id === id) ?? null;
  }
}
