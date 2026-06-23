import{Component}  from'@angular/core';
import {RouterLink} from '@angular/router';
import {HeaderComponent} from '../_shared/componentes/navegacion/header.component';
import {FooterComponent} from '../_shared/componentes/navegacion/footer.component';
import {StorageService} from '../_services/storage.service';
import {BotonComponent} from "../_shared/componentes/botones/boton.component";
import {TextoTituloComponent} from "../_shared/componentes/texto/texto-titulo.component";
import {TextoNormalComponent} from "../_shared/componentes/texto/texto-normal.component";
import {TextoPequenoComponent} from "../_shared/componentes/texto/texto-pequeno.component";
import {PilaHorizontalComponent} from "../_shared/componentes/diseno/pila-horizontal.component";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink, BotonComponent,
    TextoTituloComponent, TextoNormalComponent, TextoPequenoComponent, PilaHorizontalComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-amber-50/30">
      <app-header/>

      <main class="flex-1 max-w-5xl mx-auto w-full px-4 py-10">


        <div class="flex flex-col items-center justify-center py-24 gap-4 text-center">
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


        <app-pila-horizontal>
          <div class="flex-1">
            <img src="https://ucsp.edu.pe/wp-content/uploads/2023/08/1.-PRESENTACION_BIBLIOTECA-33-scaled.jpg" alt="1">
          </div>
          <div class="flex-1 w-full h-full">
            <texto-normal>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed ex leo. Curabitur id
              tincidunt quam, id lobortis sapien. Sed tellus dolor, fringilla id purus non, vehicula dapibus neque.
              Integer auctor condimentum turpis, vitae feugiat elit lacinia ut. Ut gravida hendrerit purus, a ornare
              tellus commodo sed. Maecenas felis nulla, imperdiet et tellus eleifend, auctor dictum mauris. Duis egestas
              enim vel sem sodales, at dictum mauris facilisis. Pellentesque tempor accumsan laoreet. Praesent risus
              urna, aliquam commodo lectus ac, pellentesque dictum libero. Sed quis massa in lectus ullamcorper
              pellentesque ac at nisi.
            </texto-normal>
          </div>
        </app-pila-horizontal>

        <app-pila-horizontal>

        </app-pila-horizontal>
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
