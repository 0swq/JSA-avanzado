import { Component } from '@angular/core';
import { HeaderComponent } from '../_shared/componentes/navegacion/header.component';
import { FooterComponent } from '../_shared/componentes/navegacion/footer.component';
import { ContenedorComponent } from '../_shared/componentes/diseno/contenedor.component';
import { PilaVerticalComponent } from '../_shared/componentes/diseno/pila-vertical.component';
import { TituloComponent } from '../_shared/componentes/texto/titulo.component';
import { TextoNormalComponent } from '../_shared/componentes/texto/texto-normal.component';
import { TarjetaComponent } from '../_shared/componentes/datos/tarjeta.component';
import { BotonComponent } from '../_shared/componentes/botones/boton.component';
import { BotonContornoComponent } from '../_shared/componentes/botones/boton-contorno.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    HeaderComponent, FooterComponent, ContenedorComponent, PilaVerticalComponent,
    TituloComponent, TextoNormalComponent, TarjetaComponent, BotonComponent, BotonContornoComponent,
  ],
  template: `
    <app-header />

    <app-contenedor anchoMaximo="6xl">
      <app-pila-vertical espacio="8">

        <!-- Hero -->
        <section class="text-center py-12 md:py-20">
          <app-pila-vertical espacio="4" alinear="centro">
            <app-titulo nivel="h1" tamanio="5xl" peso="extranegrita">
              📚 Bienvenido a la Biblioteca JSA
            </app-titulo>
            <app-texto-normal tamanio="lg" color="gris">
              Explora nuestro catálogo, reserva libros y accede a recursos digitales.
            </app-texto-normal>
            <div class="flex gap-3 justify-center mt-4">
              <a routerLink="/catalogo" class="no-underline">
                <app-boton etiqueta="Ver Catálogo" tamanio="lg"
                  icono='<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' />
              </a>
              <a routerLink="/register" class="no-underline">
                <app-boton-contorno etiqueta="Registrarse" tamanio="lg"
                  icono='<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>' />
              </a>
            </div>
          </app-pila-vertical>
        </section>

        <!-- Tarjetas -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <app-tarjeta titulo="📖 Catálogo" subtitulo="Libros, revistas y más">
            <app-texto-normal tamanio="sm" color="gris">
              Explora nuestra colección completa de material bibliográfico disponible para préstamo y consulta.
            </app-texto-normal>
          </app-tarjeta>

          <app-tarjeta titulo="💻 Recursos Digitales" subtitulo="Acceso en línea">
            <app-texto-normal tamanio="sm" color="gris">
              Accede a e-books, artículos académicos y bases de datos desde cualquier lugar.
            </app-texto-normal>
          </app-tarjeta>

          <app-tarjeta titulo="📅 Reservas" subtitulo="Aparta tu material">
            <app-texto-normal tamanio="sm" color="gris">
              Reserva los libros que necesitas y recógelos en la biblioteca sin filas.
            </app-texto-normal>
          </app-tarjeta>
        </section>

      </app-pila-vertical>
    </app-contenedor>

    <app-footer />
  `,
  styles: `.no-underline { text-decoration: none; }`,
})
export class InicioComponent {}
