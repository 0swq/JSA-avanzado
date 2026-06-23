import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HeaderComponent} from '../../_shared/componentes/navegacion/header.component';
import {FooterComponent} from '../../_shared/componentes/navegacion/footer.component';
import {BotonComponent} from '../../_shared/componentes/botones/boton.component';
import {BotonContornoComponent} from '../../_shared/componentes/botones/boton-contorno.component';
import {TextoNormalComponent} from '../../_shared/componentes/texto/texto-normal.component';
import {TextTituloComponent} from '../../_shared/componentes/texto/text-titulo.component';
import {TarjetaComponent} from '../../_shared/componentes/datos/tarjeta.component';
import {EntradaComponent} from '../../_shared/componentes/entradas/entrada.component';
import {EntradaNumeroComponent} from '../../_shared/componentes/entradas/entrada-numero.component';
import {SelectorComponent} from '../../_shared/componentes/entradas/selector.component';
import {AlertaComponent} from '../../_shared/componentes/retroalimentacion/alerta.component';
import {NavigationService} from '../../_services/navigation-store';
import {SidebarComponent} from "../../_shared/componentes/navegacion/sidebar.component";

@Component({
  selector: 'app-editar-libro',
  standalone: true,
  imports: [
    BotonComponent, BotonContornoComponent,
    TextoNormalComponent, TextTituloComponent,
    TarjetaComponent,
    EntradaComponent, EntradaNumeroComponent, SelectorComponent,
    AlertaComponent, FormsModule, RouterModule, SidebarComponent,
  ],
  template: `
    <div class="flex min-h-screen bg-stone-50">
      <app-sidebar></app-sidebar>

      <main class="flex-1 flex flex-col min-w-0">
        <div class="px-6 py-6 max-w-7xl w-full mx-auto">
        <button
          type="button"
          (click)="cancelar()"
          class="text-sm text-stone-500 hover:text-stone-700 mb-6 inline-flex items-center gap-1">
          ← Volver a libros
        </button>

        <div class="flex flex-col gap-6">

          <texto-titulo>Editar Libro</texto-titulo>
          <texto-normal>Modifica la información de este libro.</texto-normal>

          @if (exito) {
            <app-alerta tipo="exito" mensaje="Libro actualizado correctamente."/>
          }

          @if (error) {
            <app-alerta tipo="error" [mensaje]="error"/>
          }
          @if (cargando) {
            <div class="flex justify-center py-12">
              <svg class="animate-spin w-8 h-8 text-amber-600" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          }
          @if (!cargando && !libroOriginal && !exito) {
            <div class="text-center py-12">
              <texto-normal>No se encontró el libro a editar.</texto-normal>
              <app-boton
                class="mt-4"
                etiqueta="Ir a libros"
                tamanio="sm"
                (presionado)="cancelar()"/>
            </div>
          }

          @if (!cargando && libroOriginal && !exito) {
            <app-tarjeta titulo="Información del libro">
              <div class="flex flex-col gap-6">

                @if (foto) {
                  <div class="flex flex-col sm:flex-row gap-4 items-start">
                    <div class="aspect-[9/16] w-32 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden
                                flex items-center justify-center text-gray-400">
                      @if (!errorImagen) {
                        <img
                          [src]="foto"
                          alt="Portada actual"
                          (error)="errorImagen = true"
                          class="w-full h-full object-cover"/>
                      } @else {
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                        </svg>
                      }
                    </div>
                    <div class="flex flex-col gap-1 pt-1">
                      <span class="text-sm font-medium text-stone-700">{{ libroOriginal.titulo }}</span>
                      <span class="text-xs text-gray-400">Portada actual</span>
                    </div>
                  </div>
                }

                <app-entrada
                  etiqueta="Título"
                  id="titulo"
                  placeholder="Título del libro"
                  [valor]="titulo"
                  (valorCambio)="titulo = $event"
                  [requerido]="true"
                  [error]="errores.titulo"/>

                <app-entrada
                  etiqueta="ISBN"
                  id="isbn"
                  placeholder="978-..."
                  [valor]="isbn"
                  (valorCambio)="isbn = $event"/>

                <div class="flex flex-col gap-1">
                  <label for="autores" class="text-sm font-medium text-gray-700">
                    Autores <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="autores"
                    type="text"
                    [ngModel]="autores"
                    (ngModelChange)="onAutoresCambio($event)"
                    placeholder="Gabriel García Márquez, Isabel Allende"
                    class="w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-150
                           focus:outline-none focus:ring-2 focus:ring-offset-0
                           focus:border-blue-500 focus:ring-blue-200 border-gray-300"
                    [class.border-red-400]="errores.autores"
                  />
                  @if (errores.autores) {
                    <span class="text-xs text-red-500 ml-1">{{ errores.autores }}</span>
                  } @else {
                    <span class="text-xs text-gray-400 ml-1">Separa los autores con comas.</span>
                  }
                </div>

                <app-selector
                  etiqueta="Editorial"
                  id="editorial"
                  [opciones]="opcionesEditoriales"
                  [valor]="editorial"
                  (valorCambio)="editorial = $event"
                  placeholder="Selecciona una editorial..."/>

                <div class="flex flex-col sm:flex-row gap-4">
                  <div class="flex-1">
                    <app-entrada-numero
                      etiqueta="Año de publicación"
                      id="anio"
                      [min]="0"
                      [max]="2026"
                      [paso]="1"
                      [valor]="anioPublicacion"
                      (valorCambio)="anioPublicacion = $event"/>
                  </div>
                  <div class="flex-1">
                    <app-selector
                      etiqueta="Idioma"
                      id="idioma"
                      [opciones]="opcionesIdiomas"
                      [valor]="idioma"
                      (valorCambio)="idioma = $event"
                      placeholder="Selecciona..."/>
                  </div>
                </div>

                <div class="flex flex-col gap-1">
                  <label for="descripcion" class="text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    id="descripcion"
                    [(ngModel)]="descripcion"
                    rows="4"
                    placeholder="Sinopsis o resumen del libro..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                           transition-colors duration-150"></textarea>
                </div>

                <div class="flex flex-col gap-1">
                  <label for="categorias" class="text-sm font-medium text-gray-700">Categorías</label>
                  <input
                    id="categorias"
                    type="text"
                    [ngModel]="categorias"
                    (ngModelChange)="onCategoriasCambio($event)"
                    placeholder="Literatura, Realismo mágico, Clásicos"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                           transition-colors duration-150"/>
                  <span class="text-xs text-gray-400 ml-1">Separa las categorías con comas.</span>
                </div>

                <app-entrada
                  etiqueta="Foto (URL)"
                  id="foto"
                  placeholder="https://covers.openlibrary.org/b/isbn/..."
                  [valor]="foto"
                  (valorCambio)="onFotoCambio($event)"/>

                <div class="bg-stone-50 rounded-lg border border-stone-200 p-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-stone-700">Resumen</span>
                    <div class="flex justify-between text-sm text-stone-600">
                      <span>Título</span>
                      <span class="font-medium text-stone-800 text-right max-w-[60%] truncate">{{ titulo || '—' }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-stone-600">
                      <span>Autores</span>
                      <span class="text-right max-w-[60%] truncate">{{ autores || '—' }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-stone-600">
                      <span>Editorial</span>
                      <span>{{ editorial || '—' }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-stone-600">
                      <span>Año</span>
                      <span>{{ anioPublicacion }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                  <app-boton
                    etiqueta="Guardar Cambios"
                    tamanio="md"
                    [anchoCompleto]="false"
                    [deshabilitado]="!formularioValido"
                    (presionado)="guardarCambios()"/>
                  <app-boton-contorno
                    etiqueta="Cancelar"
                    tamanio="md"
                    [anchoCompleto]="false"
                    (presionado)="cancelar()"/>
                </div>

              </div>
            </app-tarjeta>
          }

        </div>
        </div>
      </main>

    </div>
  `,
})
export class EditarLibroComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  cargando: boolean = true;
  libroOriginal: any = null;
  errorImagen: boolean = false;

  titulo: string = '';
  isbn: string = '';
  autores: string = '';
  editorial: string = '';
  anioPublicacion: number = 2026;
  idioma: string = '';
  descripcion: string = '';
  categorias: string = '';
  foto: string = '';

  errores: { titulo: string; autores: string } = {titulo: '', autores: ''};
  exito: boolean = false;
  error: string = '';

  opcionesIdiomas: Array<{ etiqueta: string; valor: string }> = [
    {etiqueta: 'Español', valor: 'Español'},
    {etiqueta: 'Inglés', valor: 'Inglés'},
    {etiqueta: 'Francés', valor: 'Francés'},
    {etiqueta: 'Alemán', valor: 'Alemán'},
    {etiqueta: 'Italiano', valor: 'Italiano'},
    {etiqueta: 'Portugués', valor: 'Portugués'},
    {etiqueta: 'Ruso', valor: 'Ruso'},
    {etiqueta: 'Chino', valor: 'Chino'},
    {etiqueta: 'Japonés', valor: 'Japonés'},
    {etiqueta: 'Otro', valor: 'Otro'},
  ];

  opcionesEditoriales: Array<{ etiqueta: string; valor: string }> = [
    {etiqueta: 'Editorial Sudamericana', valor: 'Editorial Sudamericana'},
    {etiqueta: 'Editorial Cátedra', valor: 'Editorial Cátedra'},
    {etiqueta: 'Planeta', valor: 'Planeta'},
    {etiqueta: 'Penguin Classics', valor: 'Penguin Classics'},
    {etiqueta: 'Bantam Books', valor: 'Bantam Books'},
    {etiqueta: 'Prentice Hall', valor: 'Prentice Hall'},
    {etiqueta: 'MIT Press', valor: 'MIT Press'},
    {etiqueta: 'Plaza & Janés', valor: 'Plaza & Janés'},
  ];

  ngOnInit(): void {
    const id = this.navigationService.store.getState().libroSeleccionadoId;
    if (!id) {
      this.cargando = false;
      return;
    }
    this.cargarLibro(id);
  }

  cargarLibro(id: string): void {
    const hardcoded = this.obtenerLibrosHardcoded();
    const guardados = JSON.parse(localStorage.getItem('libros') ?? '[]');
    const todos = [...hardcoded, ...guardados];
    const encontrado = todos.find((l: any) => l.id === id) ?? null;

    if (!encontrado) {
      this.cargando = false;
      return;
    }

    this.libroOriginal = encontrado;
    this.titulo = encontrado.titulo || '';
    this.isbn = encontrado.isbn || '';
    this.autores = (encontrado.autores || []).join(', ');
    this.editorial = encontrado.editorial || '';
    this.anioPublicacion = encontrado.anioPublicacion || 2026;
    this.idioma = encontrado.idioma || '';
    this.descripcion = encontrado.descripcion || '';
    this.categorias = (encontrado.categorias || []).join(', ');
    this.foto = encontrado.foto || '';
    this.cargando = false;
  }

  get formularioValido(): boolean {
    return (
      this.titulo.trim().length > 0 &&
      this.autores.trim().length > 0 &&
      !this.exito
    );
  }

  onAutoresCambio(valor: string): void {
    this.autores = valor;
    this.errores.autores = '';
  }

  onCategoriasCambio(valor: string): void {
    this.categorias = valor;
  }

  onFotoCambio(valor: string): void {
    this.foto = valor;
    this.errorImagen = false;
  }

  guardarCambios(): void {
    this.exito = true;
    this.error = '';
  }

  cancelar(): void {
    this.router.navigate(['/admin/libros']);
  }
  obtenerLibrosHardcoded(): any[] {
    return [
      {
        id: '8f1e2c10-1a2b-4c3d-9e8f-111111111111',
        titulo: 'Cien Años de Soledad', isbn: '978-0307474728',
        anioPublicacion: 1967, idioma: 'Español',
        descripcion: 'La historia de la familia Buendía a lo largo de varias generaciones en Macondo.',
        editorial: 'Editorial Sudamericana', autores: ['Gabriel García Márquez'],
        categorias: ['Literatura', 'Realismo mágico'],
        ejemplaresDisponibles: 3, ejemplaresTotal: 5,
        foto: 'https://covers.openlibrary.org/b/isbn/9780307474728-M.jpg',
        archivosDigitales: ['pdf', 'mp3'],
      },
      {
        id: '8f1e2c10-1a2b-4c3d-9e8f-222222222222',
        titulo: 'Clean Code', isbn: '978-0132350884',
        anioPublicacion: 2008, idioma: 'Inglés',
        descripcion: 'Una guía de buenas prácticas para escribir código limpio y mantenible.',
        editorial: 'Prentice Hall', autores: ['Robert C. Martin'],
        categorias: ['Ingeniería de Software', 'Tecnología'],
        ejemplaresDisponibles: 0, ejemplaresTotal: 2,
        foto: 'https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg',
        archivosDigitales: ['pdf'],
      },
      {
        id: '8f1e2c10-1a2b-4c3d-9e8f-333333333333',
        titulo: 'Don Quijote de la Mancha', isbn: '978-8420412146',
        anioPublicacion: 1605, idioma: 'Español',
        descripcion: 'Las aventuras de un hidalgo que enloquece leyendo novelas de caballería.',
        editorial: 'Editorial Cátedra', autores: ['Miguel de Cervantes'],
        categorias: ['Literatura', 'Clásicos'],
        ejemplaresDisponibles: 2, ejemplaresTotal: 4,
        foto: 'https://covers.openlibrary.org/b/isbn/9788420412146-M.jpg',
        archivosDigitales: ['pdf', 'mp3', 'mp4'],
      },
      {
        id: '8f1e2c10-1a2b-4c3d-9e8f-444444444444',
        titulo: 'Breve Historia del Tiempo', isbn: '978-0553380163',
        anioPublicacion: 1988, idioma: 'Español',
        descripcion: 'Una introducción accesible a la cosmología y la física moderna.',
        editorial: 'Bantam Books', autores: ['Stephen Hawking'],
        categorias: ['Ciencia', 'Física'],
        ejemplaresDisponibles: 1, ejemplaresTotal: 3,
        foto: 'https://covers.openlibrary.org/b/isbn/9780553380163-M.jpg',
        archivosDigitales: ['pdf', 'mp4'],
      },
      {
        id: '8f1e2c10-1a2b-4c3d-9e8f-555555555555',
        titulo: 'Introducción a los Algoritmos', isbn: '978-0262033848',
        anioPublicacion: 2009, idioma: 'Inglés',
        descripcion: 'Texto de referencia sobre algoritmos y estructuras de datos.',
        editorial: 'MIT Press', autores: ['Thomas H. Cormen', 'Charles E. Leiserson'],
        categorias: ['Ingeniería de Software', 'Matemáticas'],
        ejemplaresDisponibles: 4, ejemplaresTotal: 6,
        foto: 'https://covers.openlibrary.org/b/isbn/9780262033848-M.jpg',
        archivosDigitales: ['pdf'],
      },
      {
        id: '8f1e2c10-1a2b-4c3d-9e8f-666666666666',
        titulo: 'La Casa de los Espíritus', isbn: '978-0525433457',
        anioPublicacion: 1982, idioma: 'Español',
        descripcion: 'Una saga familiar marcada por el amor, la política y lo sobrenatural en Chile.',
        editorial: 'Plaza & Janés', autores: ['Isabel Allende'],
        categorias: ['Literatura', 'Realismo mágico'],
        ejemplaresDisponibles: 2, ejemplaresTotal: 2,
        foto: 'https://covers.openlibrary.org/b/isbn/9780525433457-M.jpg',
        archivosDigitales: ['mp3'],
      },
    ];
  }
}
