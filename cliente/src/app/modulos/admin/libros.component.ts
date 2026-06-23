import {Component, inject} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {SidebarComponent} from '../../_shared/componentes/navegacion/sidebar.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {BotonIconoComponent} from '../../_shared/componentes/botones/boton-icono.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextoPequenoComponent} from '../../_shared/componentes/texto/texto-pequeno.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {EntradaBusquedaComponent} from '../../_shared/componentes/entradas/entrada-busqueda.component';
import {SelectorComponent} from '../../_shared/componentes/entradas/selector.component';
import {InsigniaComponent} from '../../_shared/componentes/datos/insignia.component';
import {PaginacionComponent} from '../../_shared/componentes/navegacion/paginacion.component';
import {NavigationService} from '../../_services/navigation-store';

@Component({
  selector: 'app-admin-libros',
  standalone: true,
  imports: [
    SidebarComponent, PilaVerticalComponent, PilaHorizontalComponent,
    BotonComponent,  BotonIconoComponent,
TextoPequenoComponent, TextTituloComponent,
    EntradaBusquedaComponent, SelectorComponent, InsigniaComponent,
    PaginacionComponent, FormsModule, RouterModule,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-6 py-6 max-w-7xl w-full mx-auto">

          <app-pila-horizontal espacio="4" alinear="centro" justificar="entre" class="mb-6">
            <app-pila-vertical espacio="1">
              <texto-titulo tamanio="xl">Libros</texto-titulo>
              <texto-pequeno>Administra el catálogo de libros de la biblioteca.</texto-pequeno>
            </app-pila-vertical>

            <app-boton
              etiqueta="Nuevo Libro"
              tamanio="sm"
              icono="✚"
              (presionado)="nuevoLibro()"/>
          </app-pila-horizontal>

          <div class="bg-white rounded-xl border border-stone-200 p-4 mb-6">
            <app-pila-horizontal espacio="4" alinear="fin" envolver="si">
              <app-entrada-busqueda
                class="flex-1 min-w-[240px]"
                placeholder="Buscar por título, autor o ISBN..."
                [valor]="terminoBusqueda"
                (valorCambio)="onBusquedaCambio($event)"/>

              <app-selector
                etiqueta="Categoría"
                id="filtro-categoria"
                [opciones]="opcionesCategorias"
                [valor]="filtroCategoria"
                (valorCambio)="onFiltroCategoriaCambio($event)"
                placeholder="Todas las categorías"/>

              <app-selector
                etiqueta="Disponibilidad"
                id="filtro-disponibilidad"
                [opciones]="opcionesDisponibilidad"
                [valor]="filtroDisponibilidad"
                (valorCambio)="onFiltroDisponibilidadCambio($event)"
                placeholder="Cualquier estado"/>
            </app-pila-horizontal>
          </div>
          <div class="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-stone-200 bg-stone-50">
                    <th class="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Título</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">ISBN</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Autores</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Editorial</th>
                    <th class="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Año</th>
                    <th class="text-center px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Ejemplares</th>
                    <th class="text-center px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                  @for (libro of librosPaginados; track libro.id) {
                    <tr class="hover:bg-amber-50/30 transition-colors">
                      <td class="px-5 py-3">
                        <div class="flex flex-col gap-1">
                          <a
                            [routerLink]="['/catalogo', libro.id]"
                            class="font-medium text-stone-800 hover:text-amber-700 transition-colors no-underline cursor-pointer"
                            (click)="seleccionarYVer(libro)">
                            {{ libro.titulo }}
                          </a>
                          <div class="flex flex-wrap gap-1">
                            @for (cat of libro.categorias; track cat) {
                              <app-insignia [etiqueta]="cat" color="amber" variante="sutil"/>
                            }
                          </div>
                        </div>
                      </td>

                      <td class="px-5 py-3">
                        <span class="text-xs font-mono text-stone-500">{{ libro.isbn }}</span>
                      </td>

                      <td class="px-5 py-3">
                        <texto-pequeno>{{ libro.autores.join(', ') }}</texto-pequeno>
                      </td>
                      <td class="px-5 py-3">
                        <texto-pequeno>{{ libro.editorial }}</texto-pequeno>
                      </td>
                      <td class="px-5 py-3">
                        <span class="text-xs text-stone-500">{{ libro.anioPublicacion }}</span>
                      </td>

                      <td class="px-5 py-3 text-center">
                        @if (libro.ejemplaresDisponibles > 0) {
                          <span class="text-xs font-medium text-green-700">
                            {{ libro.ejemplaresDisponibles }}/{{ libro.ejemplaresTotal }}
                          </span>
                        } @else {
                          <span class="text-xs font-medium text-red-600">
                            {{ libro.ejemplaresDisponibles }}/{{ libro.ejemplaresTotal }}
                          </span>
                        }
                      </td>
                      <td class="px-5 py-3">
                        <app-pila-horizontal espacio="1" justificar="centro">
                          <a
                            [routerLink]="['/catalogo', libro.id]"
                            (click)="seleccionarYVer(libro)"
                            class="no-underline">
                            <app-boton-icono
                              icono="👁"
                              tamanio="sm"
                              tooltip="Ver detalle"/>
                          </a>
                          <app-boton-icono
                            icono="✎"
                            tamanio="sm"
                            tooltip="Editar"
                            (presionado)="editarLibro(libro)"/>
                          <app-boton-icono
                            icono="✕"
                            tamanio="sm"
                            tooltip="Eliminar"
                            (presionado)="eliminarLibro(libro)"/>
                        </app-pila-horizontal>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="px-5 py-12 text-center">
                        <texto-pequeno>No se encontraron libros que coincidan con los filtros.</texto-pequeno>
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
                [total]="librosFiltrados.length"
                [tamanioPagina]="tamanioPagina"
                (cambioPagina)="irAPagina($event)"/>
            </div>
          }
        </div>
      </main>
    </div>
  `,
})
export class AdminLibrosComponent {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  terminoBusqueda: string = '';
  filtroCategoria: string = '';
  filtroDisponibilidad: string = '';

  opcionesDisponibilidad: Array<{ etiqueta: string; valor: string }> = [
    {etiqueta: 'Con ejemplares disponibles', valor: 'disponible'},
    {etiqueta: 'Sin ejemplares', valor: 'agotado'},
  ];

  get opcionesCategorias(): Array<{ etiqueta: string; valor: string }> {
    const cats = new Set<string>();
    this.libros.forEach(l => l.categorias.forEach(c => cats.add(c)));
    return Array.from(cats).sort().map(c => ({etiqueta: c, valor: c}));
  }

  onBusquedaCambio(valor: string): void {
    this.terminoBusqueda = valor;
    this.paginaActual = 1;
  }

  onFiltroCategoriaCambio(valor: string): void {
    this.filtroCategoria = valor;
    this.paginaActual = 1;
  }

  onFiltroDisponibilidadCambio(valor: string): void {
    this.filtroDisponibilidad = valor;
    this.paginaActual = 1;
  }

  paginaActual: number = 1;
  tamanioPagina: number = 10;

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.librosFiltrados.length / this.tamanioPagina));
  }

  get librosPaginados() {
    const inicio = (this.paginaActual - 1) * this.tamanioPagina;
    return this.librosFiltrados.slice(inicio, inicio + this.tamanioPagina);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get librosFiltrados() {
    let resultado = this.libros;
    const termino = this.terminoBusqueda.trim().toLowerCase();
    if (termino) {
      resultado = resultado.filter(l =>
        l.titulo.toLowerCase().includes(termino) ||
        l.autores.some(a => a.toLowerCase().includes(termino)) ||
        l.isbn.toLowerCase().includes(termino),
      );
    }
    if (this.filtroCategoria) {
      resultado = resultado.filter(l =>
        l.categorias.includes(this.filtroCategoria),
      );
    }
    if (this.filtroDisponibilidad === 'disponible') {
      resultado = resultado.filter(l => l.ejemplaresDisponibles > 0);
    } else if (this.filtroDisponibilidad === 'agotado') {
      resultado = resultado.filter(l => l.ejemplaresDisponibles === 0);
    }
    return resultado;
  }

  seleccionarYVer(libro: any): void {
    this.navigationService.store.getState().seleccionarLibro(libro.id);
  }

  nuevoLibro(): void {
    this.navigationService.store.getState().seleccionarLibro(null);
    this.router.navigate(['/admin/libros/crear']);
  }

  editarLibro(libro: any): void {
    this.navigationService.store.getState().seleccionarLibro(libro.id);
    this.router.navigate(['/admin/libros/editar']);
  }

  eliminarLibro(libro: any): void {
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
      archivosDigitales: ['mp3'],
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
      archivosDigitales: ['pdf', 'mp3', 'mp4'],
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
      archivosDigitales: ['pdf', 'mp3'],
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
      archivosDigitales: ['pdf', 'mp4'],
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
      archivosDigitales: ['pdf', 'mp3'],
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
      archivosDigitales: ['pdf', 'mp3', 'mp4'],
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
      archivosDigitales: ['pdf', 'mp4'],
    },
  ];
}
