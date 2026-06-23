import {Component, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {HeaderComponent} from '../../_shared/componentes/navegacion/header.component';
import {FooterComponent} from '../../_shared/componentes/navegacion/footer.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {NavigationService} from "../../_services/navigation-store";
import {PilaHorizontalComponent} from "../../_shared/componentes/diseno/pila-horizontal.component";
import {BotonContornoComponent} from "../../_shared/componentes/botones/boton-contorno.component";
import {PilaVerticalComponent} from "../../_shared/componentes/diseno/pila-vertical.component";

interface Comentario {
  id: string;
  autor: string;
  texto: string;
  fecha: Date;
}

@Component({
  selector: 'app-libro-detalle',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TarjetaComponent, BotonComponent,
    TextoNormalComponent, TextoPequenoComponent, FormsModule, DatePipe, PilaHorizontalComponent, BotonContornoComponent, PilaVerticalComponent, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col bg-amber-50/30">
      <app-header></app-header>

      <main class="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <button
          type="button"
          (click)="volver()"
          class="text-sm text-stone-500 hover:text-stone-700 mb-6 inline-flex items-center gap-1">
          ← Volver al catálogo
        </button>

        @if (libro) {
          <div class="flex flex-col gap-6">
            <app-tarjeta>
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
                    <h1 class="text-2xl font-semibold text-stone-800">{{ libro.titulo }}</h1>
                    <texto-pequeno>{{ libro.autores.join(', ') }}</texto-pequeno>
                  </div>

                  <texto-normal>{{ libro.descripcion }}</texto-normal>

                  <texto-pequeno>
                    {{ libro.editorial }} · {{ libro.anioPublicacion }} · {{ libro.idioma }} · ISBN {{ libro.isbn }}
                  </texto-pequeno>

                  <div class="flex flex-wrap gap-1.5">
                    @for (categoria of libro.categorias; track categoria) {
                      <span class="px-2 py-0.5 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                      {{ categoria }}
                    </span>
                    }
                  </div>

                  @if (libro.archivosDigitales.length > 0) {
                    <div class="flex flex-wrap gap-1.5">
                      @for (archivo of libro.archivosDigitales; track archivo) {
                        <span
                          class="px-2 py-0.5 text-xs rounded-full bg-stone-100 text-stone-600 border border-stone-200 uppercase">
                        {{ archivo }}
                      </span>
                      }
                    </div>
                  }

                  @if (libro.ejemplaresDisponibles > 0) {
                    <span class="text-sm font-medium text-green-700">
                    {{ libro.ejemplaresDisponibles }} de {{ libro.ejemplaresTotal }} disponibles
                  </span>
                  } @else {
                    <span class="text-sm font-medium text-red-600">Sin ejemplares disponibles</span>
                  }

                  <app-pila-horizontal>
                    <app-boton
                      etiqueta="Favorito"
                      tamanio="md"
                      [anchoCompleto]="false"
                      [deshabilitado]="libro.ejemplaresDisponibles === 0"/>
                    <a routerLink="/realizar-reserva">
                      <app-boton-contorno
                        etiqueta="Reservar"
                        tamanio="md"
                        [anchoCompleto]="false"
                        [deshabilitado]="libro.ejemplaresDisponibles === 0"/>
                    </a>
                    <a routerLink="/realizar-prestamo">
                      <app-boton
                        etiqueta="Hacer Prestamo"
                        tamanio="md"
                        [anchoCompleto]="false"
                        [deshabilitado]="libro.ejemplaresDisponibles === 0"/>
                    </a>
                  </app-pila-horizontal>
                </div>
              </div>
            </app-tarjeta>
            <app-tarjeta titulo="Archivos digitales">
              <div class="items-center">
                <div></div>
              </div>
            </app-tarjeta>
            <app-tarjeta>
              <div class="flex flex-col gap-4">
                <h2 class="text-lg font-semibold text-stone-800">
                  Comentarios ({{ comentariosDelLibro.length }})
                </h2>

                <div class="flex flex-col gap-2">
                <textarea
                  [(ngModel)]="nuevoComentario"
                  rows="3"
                  placeholder="Escribe tu comentario sobre este libro..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                         transition-colors duration-150"></textarea>
                  <div class="flex justify-end">
                    <app-boton
                      etiqueta="Publicar comentario"
                      tamanio="sm"
                      [anchoCompleto]="false"
                      [deshabilitado]="!nuevoComentario.trim()"
                      (presionado)="agregarComentario()"/>
                  </div>
                </div>

                <div class="flex flex-col gap-4 mt-2">
                  @for (comentario of comentariosDelLibro; track comentario.id) {
                    <div class="border-t border-stone-100 pt-3">
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-stone-800">{{ comentario.autor }}</p>
                        <texto-pequeno>{{ comentario.fecha | date: 'dd/MM/yyyy' }}</texto-pequeno>
                      </div>
                      <texto-normal>{{ comentario.texto }}</texto-normal>
                    </div>
                  } @empty {
                    <texto-pequeno>Aún no hay comentarios. ¡Sé el primero en comentar!</texto-pequeno>
                  }
                </div>
              </div>
            </app-tarjeta>
          </div>
        } @else {
          <div class="text-center py-16">
            <texto-normal>No se encontró el libro seleccionado.</texto-normal>
          </div>
        }
      </main>

      <app-footer/>
    </div>
  `,
})
export class LibroDetalleComponent {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  errorImagen = false;
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
      archivosDigitales: ['pdf', 'mp3']
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
      archivosDigitales: ['pdf']
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
      archivosDigitales: ['pdf', 'mp3', 'mp4']
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
      archivosDigitales: ['pdf', 'mp4']
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
      archivosDigitales: ['pdf']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-666666666666',
      titulo: 'La Casa de los Espíritus',
      isbn: '978-0525433457',
      anioPublicacion: 1982,
      idioma: 'Español',
      descripcion: 'Una saga familiar marcada por el amor, la política y lo sobrenatural en Chile.',
      editorial: 'Plaza & Janés',
      autores: ['Isabel Allende'],
      categorias: ['Literatura', 'Realismo mágico'],
      ejemplaresDisponibles: 2,
      ejemplaresTotal: 2,
      foto: 'https://covers.openlibrary.org/b/isbn/9780525433457-M.jpg',
      archivosDigitales: ['mp3']
    },
  ];

  get libro() {
    const id = this.navigationService.store.getState().libroSeleccionadoId;
    return this.libros.find(l => l.id === id) ?? null;
  }

  // Comentarios en memoria, agrupados por id de libro.
  // TODO: mover a un servicio/backend real cuando exista.
  comentarios: Comentario[] = [
    {
      id: 'c1',
      autor: 'María Pérez',
      texto: 'Una obra maestra, la volvería a leer mil veces.',
      fecha: new Date('2026-03-12'),
    },
    {
      id: 'c2',
      autor: 'Jorge Ramírez',
      texto: 'Me costó entrar al principio pero al final me encantó.',
      fecha: new Date('2026-05-02'),
    },
  ];

  comentariosPorLibro: Record<string, Comentario[]> = {
    '8f1e2c10-1a2b-4c3d-9e8f-111111111111': this.comentarios,
  };

  nuevoComentario: string = '';

  get comentariosDelLibro(): Comentario[] {
    if (!this.libro) {
      return [];
    }
    return this.comentariosPorLibro[this.libro.id] ?? [];
  }

  agregarComentario(): void {
    const texto = this.nuevoComentario.trim();
    if (!texto || !this.libro) {
      return;
    }

    const comentario: Comentario = {
      id: crypto.randomUUID(),
      autor: 'Tú',
      texto,
      fecha: new Date(),
    };

    const idLibro = this.libro.id;
    const actuales = this.comentariosPorLibro[idLibro] ?? [];
    this.comentariosPorLibro[idLibro] = [comentario, ...actuales];
    this.nuevoComentario = '';
  }

  volver(): void {
    this.router.navigate(['/catalogo']);
  }
}
