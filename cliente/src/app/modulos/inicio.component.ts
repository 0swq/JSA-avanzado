import{Component}  from'@angular/core';
import {RouterLink} from '@angular/router';
import {HeaderComponent} from '../_shared/componentes/navegacion/header.component';
import {FooterComponent} from '../_shared/componentes/navegacion/footer.component';
import {StorageService} from '../_services/storage.service';
import {BotonComponent} from "../_shared/componentes/botones/boton.component";
import {TextoNormalComponent} from "../_shared/componentes/texto/texto-normal.component";
import {TextoPequenoComponent} from "../_shared/componentes/texto/texto-pequeno.component";
import {PilaHorizontalComponent} from "../_shared/componentes/diseno/pila-horizontal.component";
import {TarjetaComponent} from "../_shared/componentes/datos/tarjeta.component";
import {TextTituloComponent} from "../_shared/componentes/texto/text-titulo.component";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink, BotonComponent,
     TextoNormalComponent, TextoPequenoComponent, PilaHorizontalComponent, TarjetaComponent, TextTituloComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-amber-50/30">
      <app-header/>

      <main class="flex-1 max-w-5xl mx-auto w-full px-4 py-10">

        <div class="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <texto-titulo>Biblioteca Universitaria JSA</texto-titulo>
          @if (!logueado) {
            <texto-normal>Inicia sesión para acceder a tus préstamos, reservas y recursos digitales.</texto-normal>
            <a routerLink="/login" class="no-underline mt-2">
              <app-boton etiqueta="Iniciar Sesión" tamanio="md"/>
            </a>
          } @else {
            <texto-normal>Bienvenido de nuevo. Explora el catálogo y gestiona tus préstamos y reservas.</texto-normal>
            <a routerLink="/catalogo" class="no-underline mt-2">
              <app-boton etiqueta="Ver disponibles" tamanio="md"/>
            </a>
          }
        </div>

        <div class="flex flex-col gap-8 pb-16">

          <app-tarjeta>
            <app-pila-horizontal>
              <div class="flex-1">
                <img
                  src="https://ucsp.edu.pe/wp-content/uploads/2023/08/1.-PRESENTACION_BIBLIOTECA-33-scaled.jpg"
                  alt="Sala de lectura de la Biblioteca Universitaria JSA"
                  class="rounded-xl object-cover w-full h-64 md:h-full shadow-sm"
                >
              </div>
              <div class="flex-1 w-full h-full flex flex-col gap-2 justify-center text-left">
                <texto-pequeno>NUESTRO ESPACIO</texto-pequeno>
                <texto-normal>
                  Contamos con salas de lectura silenciosa, cubículos para trabajo grupal
                  y una hemeroteca con publicaciones especializadas. Cada semestre suman
                  nuevas colecciones físicas y digitales para acompañar tu investigación,
                  desde pregrado hasta posgrado.
                </texto-normal>
              </div>
            </app-pila-horizontal>
          </app-tarjeta>

          <app-tarjeta>
            <app-pila-horizontal>
              <div class="flex-1 text-left md:pr-6">
                <p class="font-semibold text-stone-800 mb-1">Catálogo en línea</p>
                <texto-normal>
                  Busca libros, tesis y artículos, y revisa su disponibilidad antes de venir al campus.
                </texto-normal>
              </div>
              <div class="flex-1 text-left md:px-6 md:border-l md:border-amber-100">
                <p class="font-semibold text-stone-800 mb-1">Salas de estudio</p>
                <texto-normal>
                  Reserva un cubículo individual o una sala grupal desde el sistema de reservas.
                </texto-normal>
              </div>
              <div class="flex-1 text-left md:pl-6 md:border-l md:border-amber-100">
                <p class="font-semibold text-stone-800 mb-1">Préstamo a domicilio</p>
                <texto-normal>
                  Lleva los materiales que necesites por hasta 15 días y renueva tu préstamo en línea.
                </texto-normal>
              </div>
            </app-pila-horizontal>
          </app-tarjeta>

        </div>
      </main>

      <app-footer/>
    </div>
  `,
  styles: `.no-underline {
    text-decoration: none;
  }`,
})
export class InicioComponent {
  constructor(public storage: StorageService) {
  }

  get logueado(): boolean {
    return this.storage.isLoggedIn();
  }

}
