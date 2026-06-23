import {Component, inject} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HeaderComponent} from '../../_shared/componentes/navegacion/header.component';
import {FooterComponent} from '../../_shared/componentes/navegacion/footer.component';
import {PilaVerticalComponent} from '../../_shared/componentes/diseno/pila-vertical.component';
import {PilaHorizontalComponent} from '../../_shared/componentes/diseno/pila-horizontal.component';
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
  selector: 'app-crear-libro',
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

            <texto-titulo>Crear Libro</texto-titulo>
            <texto-normal>Registra un nuevo libro en el catálogo.</texto-normal>

            @if (exito) {
              <app-alerta tipo="exito" mensaje="Libro creado correctamente."/>
            }

            @if (error) {
              <app-alerta tipo="error" [mensaje]="error"/>
            }

            @if (!exito) {
              <app-tarjeta titulo="Información del libro">
                <div class="flex flex-col gap-6">

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
                    (valorCambio)="foto = $event"/>

                  @if (foto) {
                    <div class="flex flex-col gap-1">
                      <span class="text-sm font-medium text-gray-700">Vista previa de portada</span>
                      <div class="aspect-[9/16] w-32 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden
                                flex items-center justify-center text-gray-400">
                        @if (!errorImagen) {
                          <img
                            [src]="foto"
                            alt="Portada del libro"
                            (error)="errorImagen = true"
                            class="w-full h-full object-cover"/>
                        } @else {
                          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                          </svg>
                        }
                      </div>
                    </div>
                  }

                  @if (titulo || autores) {
                    <div class="bg-stone-50 rounded-lg border border-stone-200 p-4">
                      <div class="flex flex-col gap-1">
                        <span class="text-sm font-medium text-stone-700">Resumen</span>
                        @if (titulo) {
                          <div class="flex justify-between text-sm text-stone-600">
                            <span>Título</span>
                            <span class="font-medium text-stone-800 text-right max-w-[60%] truncate">{{ titulo }}</span>
                          </div>
                        }
                        @if (autores) {
                          <div class="flex justify-between text-sm text-stone-600">
                            <span>Autores</span>
                            <span class="text-right max-w-[60%] truncate">{{ autores }}</span>
                          </div>
                        }
                        @if (editorial) {
                          <div class="flex justify-between text-sm text-stone-600">
                            <span>Editorial</span>
                            <span>{{ editorial }}</span>
                          </div>
                        }
                        @if (anioPublicacion) {
                          <div class="flex justify-between text-sm text-stone-600">
                            <span>Año</span>
                            <span>{{ anioPublicacion }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  }

                  <div class="flex flex-col sm:flex-row gap-4">
                    <app-boton
                      etiqueta="Crear Libro"
                      tamanio="md"
                      [anchoCompleto]="false"
                      [deshabilitado]="!formularioValido"
                      (presionado)="crearLibro()"/>
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
export class CrearLibroComponent {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  titulo: string = '';
  isbn: string = '';
  autores: string = '';
  editorial: string = '';
  anioPublicacion: number = 2026;
  idioma: string = '';
  descripcion: string = '';
  categorias: string = '';
  foto: string = '';
  errorImagen: boolean = false;

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

  crearLibro(): void {
    this.errores.titulo = '';
    this.errores.autores = '';

    if (!this.titulo.trim()) {
      this.errores.titulo = 'El título es obligatorio.';
    }
    if (!this.autores.trim()) {
      this.errores.autores = 'Los autores son obligatorios.';
    }
    if (this.errores.titulo || this.errores.autores) {
      return;
    }


    this.exito = true;
    this.error = '';
  }

  cancelar(): void {
    this.router.navigate(['/admin/libros']);
  }
}
