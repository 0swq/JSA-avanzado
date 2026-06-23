import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {HeaderComponent} from '../../_shared/componentes/navegacion/header.component';
import {FooterComponent} from '../../_shared/componentes/navegacion/footer.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {EntradaBusquedaComponent} from "../../_shared/componentes/entradas/entrada-busqueda.component";
import {NavigationService} from "../../_services/navigation-store";


@Component({
  selector: 'app-catalogo-listado',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TarjetaComponent, BotonComponent,
    TextoNormalComponent, TextoPequenoComponent, EntradaBusquedaComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-amber-50/30">
      <app-header></app-header>

      <main class="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <div class="flex items-center justify-between gap-4 mb-8">
          <texto-normal>Explora los libros disponibles en la biblioteca.</texto-normal>
          <app-entrada-busqueda
            placeholder="Buscar por título o autor..."
            [valor]="terminoBusqueda"
            (valorCambio)="onBusquedaCambio($event)"></app-entrada-busqueda>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (libro of librosPaginados; track libro.id) {
            <app-tarjeta>
              <div class="flex flex-col gap-3">

                <div
                  class="aspect-[9/16] w-full max-w-[140px] mx-auto rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center text-gray-400">
                  @if (libro.foto && !erroresImagen.has(libro.id)) {
                    <img
                      [alt]="libro.titulo"
                      [src]="libro.foto"
                      (error)="onImagenError(libro.id)"
                      class="w-full h-full object-cover"/>
                  } @else {
                    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                    </svg>
                  }
                </div>

                <div>
                  <p class="font-semibold text-stone-800 leading-snug">{{ libro.titulo }}</p>
                  <texto-pequeno>{{ libro.autores.join(', ') }}</texto-pequeno>
                </div>

                <texto-pequeno>{{ libro.editorial }} · {{ libro.anioPublicacion }} · {{ libro.idioma }}</texto-pequeno>

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
                  <span class="text-xs font-medium text-green-700">
                    {{ libro.ejemplaresDisponibles }} de {{ libro.ejemplaresTotal }} disponibles
                  </span>
                } @else {
                  <span class="text-xs font-medium text-red-600">Sin ejemplares disponibles</span>
                }

                <app-boton etiqueta="Ver detalle" tamanio="sm" [anchoCompleto]="true"
                           (presionado)="onVerDetalle(libro)"/>
              </div>
            </app-tarjeta>
          }
        </div>

        @if (librosFiltrados.length === 0) {
          <div class="text-center py-12">
            <texto-pequeno>No se encontraron libros que coincidan con tu búsqueda.</texto-pequeno>
          </div>
        }

        @if (totalPaginas > 1) {
          <div class="flex items-center justify-center gap-2 mt-10">
            <button
              type="button"
              [disabled]="paginaActual === 1"
              (click)="irAPagina(paginaActual - 1)"
              class="px-3 py-1.5 text-sm rounded-md border border-stone-300 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors">
              Anterior
            </button>

            @for (pagina of paginasVisibles; track pagina) {
              <button
                type="button"
                (click)="irAPagina(pagina)"
                class="w-8 h-8 text-sm rounded-md transition-colors"
                [class.bg-amber-600]="pagina === paginaActual"
                [class.text-white]="pagina === paginaActual"
                [class.text-stone-600]="pagina !== paginaActual"
                [class.hover:bg-stone-100]="pagina !== paginaActual">
                {{ pagina }}
              </button>
            }

            <button
              type="button"
              [disabled]="paginaActual === totalPaginas"
              (click)="irAPagina(paginaActual + 1)"
              class="px-3 py-1.5 text-sm rounded-md border border-stone-300 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors">
              Siguiente
            </button>
          </div>
        }
      </main>

      <app-footer/>
    </div>
  `,
})
export class CatalogoListadoComponent {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  erroresImagen = new Set<string>();

  onVerDetalle(libro:any): void {
    this.navigationService.store.getState().seleccionarLibro(libro.id);
    this.router.navigate(['/catalogo', libro.id]);
  }

  onImagenError(id: string) {
    this.erroresImagen.add(id);
  }

  terminoBusqueda: string = '';

  onBusquedaCambio(valor: string): void {
    this.terminoBusqueda = valor;
    this.paginaActual = 1;
  }

  get librosFiltrados() {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    if (!termino) {
      return this.libros;
    }
    return this.libros.filter(libro =>
      libro.titulo.toLowerCase().includes(termino) ||
      libro.autores.some(autor => autor.toLowerCase().includes(termino))
    );
  }

  paginaActual: number = 1;
  tamanioPagina: number = 6;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.librosFiltrados.length / this.tamanioPagina));
  }

  get librosPaginados() {
    const inicio = (this.paginaActual - 1) * this.tamanioPagina;
    return this.librosFiltrados.slice(inicio, inicio + this.tamanioPagina);
  }

  get paginasVisibles(): number[] {
    return Array.from({length: this.totalPaginas}, (_, i) => i + 1);
  }

  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) {
      return;
    }
    this.paginaActual = pagina;
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
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-777777777777',
      titulo: 'El Principito',
      isbn: '978-0156012195',
      anioPublicacion: 1943,
      idioma: 'Español',
      descripcion: 'Un piloto se encuentra con un pequeño príncipe en el desierto del Sahara.',
      editorial: 'Reynal & Hitchcock',
      autores: ['Antoine de Saint-Exupéry'],
      categorias: ['Literatura', 'Infantil', 'Filosofía'],
      ejemplaresDisponibles: 5,
      ejemplaresTotal: 8,
      foto: 'https://covers.openlibrary.org/b/isbn/9780156012195-M.jpg',
      archivosDigitales: ['pdf', 'mp3', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-888888888888',
      titulo: '1984',
      isbn: '978-0451524935',
      anioPublicacion: 1949,
      idioma: 'Inglés',
      descripcion: 'Una distopía sobre un estado totalitario que vigila a sus ciudadanos.',
      editorial: 'Secker & Warburg',
      autores: ['George Orwell'],
      categorias: ['Literatura', 'Ciencia Ficción', 'Política'],
      ejemplaresDisponibles: 3,
      ejemplaresTotal: 5,
      foto: 'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg',
      archivosDigitales: ['pdf', 'mp3']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-999999999999',
      titulo: 'El Alquimista',
      isbn: '978-0062502174',
      anioPublicacion: 1988,
      idioma: 'Español',
      descripcion: 'Un joven pastor andaluz viaja en busca de su leyenda personal.',
      editorial: 'Editorial Planeta',
      autores: ['Paulo Coelho'],
      categorias: ['Literatura', 'Filosofía', 'Aventura'],
      ejemplaresDisponibles: 6,
      ejemplaresTotal: 7,
      foto: 'https://covers.openlibrary.org/b/isbn/9780062502174-M.jpg',
      archivosDigitales: ['pdf', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-aaaaaaaaaaaa',
      titulo: 'El Arte de la Guerra',
      isbn: '978-1590302259',
      anioPublicacion: 500,
      idioma: 'Chino',
      descripcion: 'Un tratado militar antiguo sobre estrategia y tácticas.',
      editorial: 'Shambhala',
      autores: ['Sun Tzu'],
      categorias: ['Filosofía', 'Historia', 'Estrategia'],
      ejemplaresDisponibles: 4,
      ejemplaresTotal: 6,
      foto: 'https://covers.openlibrary.org/b/isbn/9781590302259-M.jpg',
      archivosDigitales: ['pdf', 'mp3']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-bbbbbbbbbbbb',
      titulo: 'El Hobbit',
      isbn: '978-0547928227',
      anioPublicacion: 1937,
      idioma: 'Inglés',
      descripcion: 'La aventura de Bilbo Bolsón para recuperar el tesoro de los enanos.',
      editorial: 'George Allen & Unwin',
      autores: ['J.R.R. Tolkien'],
      categorias: ['Literatura', 'Fantasía', 'Aventura'],
      ejemplaresDisponibles: 7,
      ejemplaresTotal: 10,
      foto: 'https://covers.openlibrary.org/b/isbn/9780547928227-M.jpg',
      archivosDigitales: ['pdf', 'mp3', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-cccccccccccc',
      titulo: 'El Código Da Vinci',
      isbn: '978-0385504201',
      anioPublicacion: 2003,
      idioma: 'Inglés',
      descripcion: 'Un simbólogo descubre un secreto oculto en las obras de Leonardo da Vinci.',
      editorial: 'Doubleday',
      autores: ['Dan Brown'],
      categorias: ['Literatura', 'Misterio', 'Suspenso'],
      ejemplaresDisponibles: 2,
      ejemplaresTotal: 4,
      foto: 'https://covers.openlibrary.org/b/isbn/9780385504201-M.jpg',
      archivosDigitales: ['pdf', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-dddddddddddd',
      titulo: 'El Gran Gatsby',
      isbn: '978-0743273565',
      anioPublicacion: 1925,
      idioma: 'Inglés',
      descripcion: 'La trágica historia del millonario Jay Gatsby en la Era del Jazz.',
      editorial: 'Charles Scribner\'s Sons',
      autores: ['F. Scott Fitzgerald'],
      categorias: ['Literatura', 'Clásicos', 'Romance'],
      ejemplaresDisponibles: 1,
      ejemplaresTotal: 3,
      foto: 'https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg',
      archivosDigitales: ['pdf', 'mp3']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-eeeeeeeeeeee',
      titulo: 'Matar a un Ruiseñor',
      isbn: '978-0061120084',
      anioPublicacion: 1960,
      idioma: 'Inglés',
      descripcion: 'Un abogado defiende a un hombre negro acusado de violación en el sur de EE.UU.',
      editorial: 'J.B. Lippincott & Co.',
      autores: ['Harper Lee'],
      categorias: ['Literatura', 'Clásicos', 'Justicia Social'],
      ejemplaresDisponibles: 8,
      ejemplaresTotal: 10,
      foto: 'https://covers.openlibrary.org/b/isbn/9780061120084-M.jpg',
      archivosDigitales: ['pdf', 'mp3', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-ffffffffffff',
      titulo: 'La Metamorfosis',
      isbn: '978-0143105244',
      anioPublicacion: 1915,
      idioma: 'Alemán',
      descripcion: 'Gregor Samsa se despierta un día transformado en un insecto monstruoso.',
      editorial: 'Kurt Wolff Verlag',
      autores: ['Franz Kafka'],
      categorias: ['Literatura', 'Filosofía', 'Existencialismo'],
      ejemplaresDisponibles: 5,
      ejemplaresTotal: 5,
      foto: 'https://covers.openlibrary.org/b/isbn/9780143105244-M.jpg',
      archivosDigitales: ['pdf']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111112',
      titulo: 'El Señor de los Anillos: La Comunidad del Anillo',
      isbn: '978-0547928210',
      anioPublicacion: 1954,
      idioma: 'Inglés',
      descripcion: 'Frodo Bolsón debe destruir el Anillo Único en el Monte del Destino.',
      editorial: 'George Allen & Unwin',
      autores: ['J.R.R. Tolkien'],
      categorias: ['Literatura', 'Fantasía', 'Aventura'],
      ejemplaresDisponibles: 3,
      ejemplaresTotal: 5,
      foto: 'https://covers.openlibrary.org/b/isbn/9780547928210-M.jpg',
      archivosDigitales: ['pdf', 'mp3', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111113',
      titulo: 'El Psicoanalista',
      isbn: '978-8498381504',
      anioPublicacion: 2002,
      idioma: 'Español',
      descripcion: 'Un psicoanalista recibe una amenaza de muerte y debe resolver un misterio.',
      editorial: 'Planeta',
      autores: ['John Katzenbach'],
      categorias: ['Literatura', 'Misterio', 'Psicología'],
      ejemplaresDisponibles: 0,
      ejemplaresTotal: 2,
      foto: 'https://covers.openlibrary.org/b/isbn/9788498381504-M.jpg',
      archivosDigitales: ['mp3']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111114',
      titulo: 'El Túnel',
      isbn: '978-8420421278',
      anioPublicacion: 1948,
      idioma: 'Español',
      descripcion: 'Un pintor obsesionado confiesa el asesinato de su amada.',
      editorial: 'Editorial Sudamericana',
      autores: ['Ernesto Sabato'],
      categorias: ['Literatura', 'Psicología', 'Existencialismo'],
      ejemplaresDisponibles: 4,
      ejemplaresTotal: 6,
      foto: 'https://covers.openlibrary.org/b/isbn/9788420421278-M.jpg',
      archivosDigitales: ['pdf', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111115',
      titulo: 'La Sombra del Viento',
      isbn: '978-8408169776',
      anioPublicacion: 2001,
      idioma: 'Español',
      descripcion: 'Un joven descubre un libro maldito en el Cementerio de los Libros Olvidados.',
      editorial: 'Planeta',
      autores: ['Carlos Ruiz Zafón'],
      categorias: ['Literatura', 'Misterio', 'Suspenso'],
      ejemplaresDisponibles: 6,
      ejemplaresTotal: 8,
      foto: 'https://covers.openlibrary.org/b/isbn/9788408169776-M.jpg',
      archivosDigitales: ['pdf', 'mp3']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111116',
      titulo: 'El Perfume',
      isbn: '978-8435070463',
      anioPublicacion: 1985,
      idioma: 'Alemán',
      descripcion: 'Un asesino en serie obsesionado con los olores en la Francia del siglo XVIII.',
      editorial: 'Alfaguara',
      autores: ['Patrick Süskind'],
      categorias: ['Literatura', 'Misterio', 'Histórica'],
      ejemplaresDisponibles: 2,
      ejemplaresTotal: 3,
      foto: 'https://covers.openlibrary.org/b/isbn/9788435070463-M.jpg',
      archivosDigitales: ['pdf', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111117',
      titulo: 'Fahrenheit 451',
      isbn: '978-1451673319',
      anioPublicacion: 1953,
      idioma: 'Inglés',
      descripcion: 'Un bombero que quema libros cuestiona su trabajo en una sociedad totalitaria.',
      editorial: 'Ballantine Books',
      autores: ['Ray Bradbury'],
      categorias: ['Literatura', 'Ciencia Ficción', 'Distopía'],
      ejemplaresDisponibles: 5,
      ejemplaresTotal: 7,
      foto: 'https://covers.openlibrary.org/b/isbn/9781451673319-M.jpg',
      archivosDigitales: ['pdf', 'mp3']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111118',
      titulo: 'El Viejo y el Mar',
      isbn: '978-0684801223',
      anioPublicacion: 1952,
      idioma: 'Inglés',
      descripcion: 'Un viejo pescador cubano lucha contra un enorme pez en el Golfo de México.',
      editorial: 'Charles Scribner\'s Sons',
      autores: ['Ernest Hemingway'],
      categorias: ['Literatura', 'Clásicos', 'Aventura'],
      ejemplaresDisponibles: 3,
      ejemplaresTotal: 4,
      foto: 'https://covers.openlibrary.org/b/isbn/9780684801223-M.jpg',
      archivosDigitales: ['pdf', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111119',
      titulo: 'La Divina Comedia',
      isbn: '978-0141197494',
      anioPublicacion: 1320,
      idioma: 'Italiano',
      descripcion: 'El viaje de Dante a través del Infierno, el Purgatorio y el Paraíso.',
      editorial: 'Penguin Classics',
      autores: ['Dante Alighieri'],
      categorias: ['Literatura', 'Poesía', 'Clásicos'],
      ejemplaresDisponibles: 1,
      ejemplaresTotal: 2,
      foto: 'https://covers.openlibrary.org/b/isbn/9780141197494-M.jpg',
      archivosDigitales: ['pdf', 'mp3']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111120',
      titulo: 'El Retrato de Dorian Gray',
      isbn: '978-0141439572',
      anioPublicacion: 1890,
      idioma: 'Inglés',
      descripcion: 'Un joven permanece joven mientras su retrato envejece con sus pecados.',
      editorial: 'Lippincott\'s Monthly Magazine',
      autores: ['Oscar Wilde'],
      categorias: ['Literatura', 'Filosofía', 'Clásicos'],
      ejemplaresDisponibles: 4,
      ejemplaresTotal: 5,
      foto: 'https://covers.openlibrary.org/b/isbn/9780141439572-M.jpg',
      archivosDigitales: ['pdf', 'mp3', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111121',
      titulo: 'Crimen y Castigo',
      isbn: '978-0143058144',
      anioPublicacion: 1866,
      idioma: 'Ruso',
      descripcion: 'Un estudiante comete un asesinato y enfrenta las consecuencias psicológicas.',
      editorial: 'The Russian Messenger',
      autores: ['Fyodor Dostoevsky'],
      categorias: ['Literatura', 'Psicología', 'Filosofía'],
      ejemplaresDisponibles: 2,
      ejemplaresTotal: 3,
      foto: 'https://covers.openlibrary.org/b/isbn/9780143058144-M.jpg',
      archivosDigitales: ['pdf']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111122',
      titulo: 'El Diario de Ana Frank',
      isbn: '978-0553577129',
      anioPublicacion: 1947,
      idioma: 'Holandés',
      descripcion: 'El diario de una niña judía escondida durante la ocupación nazi.',
      editorial: 'Contact Publishing',
      autores: ['Ana Frank'],
      categorias: ['Historia', 'Biografía', 'Holocausto'],
      ejemplaresDisponibles: 7,
      ejemplaresTotal: 8,
      foto: 'https://covers.openlibrary.org/b/isbn/9780553577129-M.jpg',
      archivosDigitales: ['pdf', 'mp3', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111123',
      titulo: 'La Biblia',
      isbn: '978-0521706382',
      anioPublicacion: -1000,
      idioma: 'Hebreo',
      descripcion: 'El texto sagrado del cristianismo y el judaísmo.',
      editorial: 'Varias editoriales',
      autores: ['Varios autores'],
      categorias: ['Religión', 'Historia', 'Filosofía'],
      ejemplaresDisponibles: 10,
      ejemplaresTotal: 15,
      foto: 'https://covers.openlibrary.org/b/isbn/9780521706382-M.jpg',
      archivosDigitales: ['pdf', 'mp3', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111124',
      titulo: 'El Corán',
      isbn: '978-0199535945',
      anioPublicacion: 610,
      idioma: 'Árabe',
      descripcion: 'El texto sagrado del Islam.',
      editorial: 'Oxford University Press',
      autores: ['Mahoma'],
      categorias: ['Religión', 'Historia', 'Filosofía'],
      ejemplaresDisponibles: 8,
      ejemplaresTotal: 10,
      foto: 'https://covers.openlibrary.org/b/isbn/9780199535945-M.jpg',
      archivosDigitales: ['pdf', 'mp3']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111125',
      titulo: 'Moby Dick',
      isbn: '978-1503280786',
      anioPublicacion: 1851,
      idioma: 'Inglés',
      descripcion: 'El capitán Ahab obsesivamente persigue a la ballena blanca.',
      editorial: 'Harper & Brothers',
      autores: ['Herman Melville'],
      categorias: ['Literatura', 'Clásicos', 'Aventura'],
      ejemplaresDisponibles: 3,
      ejemplaresTotal: 5,
      foto: 'https://covers.openlibrary.org/b/isbn/9781503280786-M.jpg',
      archivosDigitales: ['pdf', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111126',
      titulo: 'Las Aventuras de Sherlock Holmes',
      isbn: '978-0140621746',
      anioPublicacion: 1892,
      idioma: 'Inglés',
      descripcion: 'Una colección de misterios resueltos por el famoso detective.',
      editorial: 'George Newnes',
      autores: ['Arthur Conan Doyle'],
      categorias: ['Literatura', 'Misterio', 'Detective'],
      ejemplaresDisponibles: 6,
      ejemplaresTotal: 8,
      foto: 'https://covers.openlibrary.org/b/isbn/9780140621746-M.jpg',
      archivosDigitales: ['pdf', 'mp3']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111127',
      titulo: 'La Odisea',
      isbn: '978-0140268860',
      anioPublicacion: -800,
      idioma: 'Griego',
      descripcion: 'El viaje de Odiseo de regreso a casa después de la Guerra de Troya.',
      editorial: 'Penguin Classics',
      autores: ['Homero'],
      categorias: ['Literatura', 'Poesía', 'Clásicos'],
      ejemplaresDisponibles: 4,
      ejemplaresTotal: 6,
      foto: 'https://covers.openlibrary.org/b/isbn/9780140268860-M.jpg',
      archivosDigitales: ['pdf', 'mp3', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111128',
      titulo: 'La Ilíada',
      isbn: '978-0140445923',
      anioPublicacion: -750,
      idioma: 'Griego',
      descripcion: 'La historia de la Guerra de Troya y la ira de Aquiles.',
      editorial: 'Penguin Classics',
      autores: ['Homero'],
      categorias: ['Literatura', 'Poesía', 'Clásicos'],
      ejemplaresDisponibles: 5,
      ejemplaresTotal: 7,
      foto: 'https://covers.openlibrary.org/b/isbn/9780140445923-M.jpg',
      archivosDigitales: ['pdf']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111129',
      titulo: 'La Eneida',
      isbn: '978-0140445510',
      anioPublicacion: -29,
      idioma: 'Latín',
      descripcion: 'La historia del héroe troyano Eneas y la fundación de Roma.',
      editorial: 'Penguin Classics',
      autores: ['Virgilio'],
      categorias: ['Literatura', 'Poesía', 'Clásicos'],
      ejemplaresDisponibles: 2,
      ejemplaresTotal: 3,
      foto: 'https://covers.openlibrary.org/b/isbn/9780140445510-M.jpg',
      archivosDigitales: ['pdf', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111130',
      titulo: 'El Decamerón',
      isbn: '978-0140449303',
      anioPublicacion: 1353,
      idioma: 'Italiano',
      descripcion: 'Cien cuentos contados por diez jóvenes que huyen de la peste en Florencia.',
      editorial: 'Penguin Classics',
      autores: ['Giovanni Boccaccio'],
      categorias: ['Literatura', 'Cuentos', 'Clásicos'],
      ejemplaresDisponibles: 3,
      ejemplaresTotal: 4,
      foto: 'https://covers.openlibrary.org/b/isbn/9780140449303-M.jpg',
      archivosDigitales: ['pdf', 'mp3']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111131',
      titulo: 'El Conde de Montecristo',
      isbn: '978-0140449266',
      anioPublicacion: 1844,
      idioma: 'Francés',
      descripcion: 'Un hombre injustamente encarcelado busca venganza después de escapar.',
      editorial: 'Penguin Classics',
      autores: ['Alexandre Dumas'],
      categorias: ['Literatura', 'Aventura', 'Venganza'],
      ejemplaresDisponibles: 5,
      ejemplaresTotal: 6,
      foto: 'https://covers.openlibrary.org/b/isbn/9780140449266-M.jpg',
      archivosDigitales: ['pdf', 'mp3', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111132',
      titulo: 'Los Tres Mosqueteros',
      isbn: '978-0141442343',
      anioPublicacion: 1844,
      idioma: 'Francés',
      descripcion: 'Las aventuras de D\'Artagnan y sus amigos mosqueteros.',
      editorial: 'Penguin Classics',
      autores: ['Alexandre Dumas'],
      categorias: ['Literatura', 'Aventura', 'Histórica'],
      ejemplaresDisponibles: 4,
      ejemplaresTotal: 5,
      foto: 'https://covers.openlibrary.org/b/isbn/9780141442343-M.jpg',
      archivosDigitales: ['pdf']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111133',
      titulo: 'Anna Karenina',
      isbn: '978-0143035008',
      anioPublicacion: 1877,
      idioma: 'Ruso',
      descripcion: 'La trágica historia de una mujer que se enamora fuera del matrimonio.',
      editorial: 'The Russian Messenger',
      autores: ['León Tolstói'],
      categorias: ['Literatura', 'Romance', 'Clásicos'],
      ejemplaresDisponibles: 2,
      ejemplaresTotal: 3,
      foto: 'https://covers.openlibrary.org/b/isbn/9780143035008-M.jpg',
      archivosDigitales: ['pdf', 'mp3']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111134',
      titulo: 'Guerra y Paz',
      isbn: '978-1400079988',
      anioPublicacion: 1869,
      idioma: 'Ruso',
      descripcion: 'La historia de varias familias rusas durante las guerras napoleónicas.',
      editorial: 'The Russian Messenger',
      autores: ['León Tolstói'],
      categorias: ['Literatura', 'Histórica', 'Clásicos'],
      ejemplaresDisponibles: 6,
      ejemplaresTotal: 8,
      foto: 'https://covers.openlibrary.org/b/isbn/9781400079988-M.jpg',
      archivosDigitales: ['pdf', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111135',
      titulo: 'El Extranjero',
      isbn: '978-0679720206',
      anioPublicacion: 1942,
      idioma: 'Francés',
      descripcion: 'Un hombre indiferente comete un asesinato y enfrenta un juicio absurdo.',
      editorial: 'Gallimard',
      autores: ['Albert Camus'],
      categorias: ['Literatura', 'Filosofía', 'Existencialismo'],
      ejemplaresDisponibles: 4,
      ejemplaresTotal: 5,
      foto: 'https://covers.openlibrary.org/b/isbn/9780679720206-M.jpg',
      archivosDigitales: ['pdf', 'mp3']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111136',
      titulo: 'El Mito de Sísifo',
      isbn: '978-0679733731',
      anioPublicacion: 1942,
      idioma: 'Francés',
      descripcion: 'Un ensayo filosófico sobre el absurdo y la búsqueda de significado.',
      editorial: 'Gallimard',
      autores: ['Albert Camus'],
      categorias: ['Filosofía', 'Existencialismo', 'Ensayo'],
      ejemplaresDisponibles: 3,
      ejemplaresTotal: 4,
      foto: 'https://covers.openlibrary.org/b/isbn/9780679733731-M.jpg',
      archivosDigitales: ['pdf']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111137',
      titulo: 'Así Habló Zaratustra',
      isbn: '978-0140441185',
      anioPublicacion: 1883,
      idioma: 'Alemán',
      descripcion: 'Un libro filosófico que introduce el concepto del Superhombre.',
      editorial: 'Penguin Classics',
      autores: ['Friedrich Nietzsche'],
      categorias: ['Filosofía', 'Existencialismo', 'Clásicos'],
      ejemplaresDisponibles: 2,
      ejemplaresTotal: 2,
      foto: 'https://covers.openlibrary.org/b/isbn/9780140441185-M.jpg',
      archivosDigitales: ['pdf', 'mp3', 'mp4']
    },
    {
      id: '8f1e2c10-1a2b-4c3d-9e8f-111111111138',
      titulo: 'El Príncipe',
      isbn: '978-0140447525',
      anioPublicacion: 1532,
      idioma: 'Italiano',
      descripcion: 'Un tratado político sobre cómo adquirir y mantener el poder.',
      editorial: 'Penguin Classics',
      autores: ['Nicolás Maquiavelo'],
      categorias: ['Política', 'Filosofía', 'Historia'],
      ejemplaresDisponibles: 5,
      ejemplaresTotal: 7,
      foto: 'https://covers.openlibrary.org/b/isbn/9780140447525-M.jpg',
      archivosDigitales: ['pdf', 'mp3']
    }
  ]
}
