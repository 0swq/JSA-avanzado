import {Component, inject, OnInit} from '@angular/core';
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
import {NavigationService} from '../../_services/navigation-store';
import {Reserva} from '../../model';

@Component({
  selector: 'app-realizar-reserva',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TarjetaComponent, BotonComponent,
    BotonContornoComponent, TextoNormalComponent, TextoPequenoComponent, TextTituloComponent,
    PilaVerticalComponent, PilaHorizontalComponent, AlertaComponent, FormsModule],
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

            <texto-titulo>Realizar Reserva</texto-titulo>
            <texto-normal>Completa el formulario para reservar este libro.</texto-normal>
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

                  @if (libro.ejemplaresDisponibles > 0) {
                    <span class="text-sm font-medium text-green-700">
                      {{ libro.ejemplaresDisponibles }} de {{ libro.ejemplaresTotal }} disponibles
                    </span>
                  } @else {
                    <span class="text-sm font-medium text-red-600">Sin ejemplares disponibles</span>
                  }
                </div>
              </div>
            </app-tarjeta>

            @if (exito) {
              <app-alerta tipo="exito" mensaje="Reserva creada correctamente. Puedes verla en Mis Reservas."/>
            }

            @if (error) {
              <app-alerta tipo="error" [mensaje]="error"/>
            }

            <app-tarjeta titulo="Datos de la reserva">
              <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-1">
                  <label for="fecha-expiracion" class="text-sm font-medium text-gray-700">
                    Fecha de expiración <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="fecha-expiracion"
                    type="date"
                    [ngModel]="fechaExpiracion"
                    (ngModelChange)="onFechaCambio($event)"
                    [min]="fechaMinima"
                    class="w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-150
                           focus:outline-none focus:ring-2 focus:ring-offset-0
                           focus:border-amber-500 focus:ring-amber-200 border-gray-300"
                  />
                  <span class="text-xs text-gray-400 ml-1">
                    La reserva vence automáticamente en esta fecha si no se completa.
                  </span>
                </div>

                <div class="flex flex-col gap-1">
                  <label for="notas" class="text-sm font-medium text-gray-700">Notas (opcional)</label>
                  <textarea
                    id="notas"
                    [(ngModel)]="notas"
                    rows="3"
                    placeholder="Indica alguna preferencia o comentario adicional..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500
                           transition-colors duration-150"></textarea>
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                  <app-boton
                    etiqueta="Confirmar Reserva"
                    tamanio="md"
                    [anchoCompleto]="false"
                    [deshabilitado]="!formularioValido"
                    (presionado)="confirmarReserva()"/>
                  <app-boton-contorno
                    etiqueta="Cancelar"
                    tamanio="md"
                    [anchoCompleto]="false"
                    (presionado)="volver()"/>
                </div>
              </div>
            </app-tarjeta>

          </div>
        } @else {
          <div class="text-center py-16">
            <texto-normal>No se encontró el libro a reservar.</texto-normal>
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
export class RealizarReservaComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  errorImagen = false;
  exito = false;
  error: string = '';
  fechaExpiracion: string = '';
  notas: string = '';

  ngOnInit(): void {
    const id = this.navigationService.store.getState().libroSeleccionadoId;
    if (!id) {
    }
  }

  get fechaMinima(): string {
    const maniana = new Date();
    maniana.setDate(maniana.getDate() + 1);
    return maniana.toISOString().split('T')[0];
  }

  get formularioValido(): boolean {
    return !!this.fechaExpiracion && !this.exito;
  }

  onFechaCambio(valor: string): void {
    this.fechaExpiracion = valor;
  }

  confirmarReserva(): void {
    if (!this.libro || !this.fechaExpiracion) {
      this.error = 'La fecha de expiración es obligatoria.';
      return;
    }

    const nuevaReserva: Reserva = {
      id: crypto.randomUUID(),
      usuarioId: 'usuario-actual',
      libroId: this.libro.id,
      fechaExpiracion: new Date(this.fechaExpiracion).toISOString(),
      estado: 'pendiente',
      creadoEn: new Date().toISOString(),
    };

    this.navigationService.store.getState().seleccionarReserva(nuevaReserva.id);

    const reservasGuardadas = JSON.parse(localStorage.getItem('reservas') ?? '[]');
    reservasGuardadas.push(nuevaReserva);
    localStorage.setItem('reservas', JSON.stringify(reservasGuardadas));

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
      isbn: '978-0307474728', anioPublicacion: 1967, idioma: 'Español',
      descripcion: 'La historia de la familia Buendía a lo largo de varias generaciones en Macondo.',
      editorial: 'Editorial Sudamericana', autores: ['Gabriel García Márquez'],
      categorias: ['Literatura', 'Realismo mágico'], ejemplaresDisponibles: 3, ejemplaresTotal: 5,
      foto: 'https://covers.openlibrary.org/b/isbn/9780307474728-M.jpg',
      archivosDigitales: ['pdf', 'mp3']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-222222222222',
      titulo: 'Clean Code', isbn: '978-0132350884', anioPublicacion: 2008, idioma: 'Inglés',
      descripcion: 'Una guía de buenas prácticas para escribir código limpio y mantenible.',
      editorial: 'Prentice Hall', autores: ['Robert C. Martin'],
      categorias: ['Ingeniería de Software', 'Tecnología'], ejemplaresDisponibles: 0, ejemplaresTotal: 2,
      foto: 'https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg',
      archivosDigitales: ['pdf']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-333333333333',
      titulo: 'Don Quijote de la Mancha', isbn: '978-8420412146', anioPublicacion: 1605, idioma: 'Español',
      descripcion: 'Las aventuras de un hidalgo que enloquece leyendo novelas de caballería.',
      editorial: 'Editorial Cátedra', autores: ['Miguel de Cervantes'],
      categorias: ['Literatura', 'Clásicos'], ejemplaresDisponibles: 2, ejemplaresTotal: 4,
      foto: 'https://covers.openlibrary.org/b/isbn/9788420412146-M.jpg',
      archivosDigitales: ['pdf', 'mp3', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-444444444444',
      titulo: 'Breve Historia del Tiempo', isbn: '978-0553380163', anioPublicacion: 1988, idioma: 'Español',
      descripcion: 'Una introducción accesible a la cosmología y la física moderna.',
      editorial: 'Bantam Books', autores: ['Stephen Hawking'],
      categorias: ['Ciencia', 'Física'], ejemplaresDisponibles: 1, ejemplaresTotal: 3,
      foto: 'https://covers.openlibrary.org/b/isbn/9780553380163-M.jpg',
      archivosDigitales: ['pdf', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-555555555555',
      titulo: 'Introducción a los Algoritmos', isbn: '978-0262033848', anioPublicacion: 2009, idioma: 'Inglés',
      descripcion: 'Texto de referencia sobre algoritmos y estructuras de datos.',
      editorial: 'MIT Press', autores: ['Thomas H. Cormen', 'Charles E. Leiserson'],
      categorias: ['Ingeniería de Software', 'Matemáticas'], ejemplaresDisponibles: 4, ejemplaresTotal: 6,
      foto: 'https://covers.openlibrary.org/b/isbn/9780262033848-M.jpg',
      archivosDigitales: ['pdf']
    },
  ];

  get libro() {
    const id = this.navigationService.store.getState().libroSeleccionadoId;
    return this.libros.find(l => l.id === id) ?? null;
  }
}
