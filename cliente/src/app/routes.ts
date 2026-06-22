import {Routes} from '@angular/router';
import {AuthGuard} from './_helpers/auth.guard';
import {RoleGuard} from './_helpers/role.guard';

import {InicioComponent} from './modulos/inicio.component';
import {LoginComponent} from './modulos/auth/login.component';
import {RegisterComponent} from './modulos/auth/register.component';
import {CatalogoListadoComponent} from './modulos/libros-publico/catalogo-listado.component';
import {LibroDetalleComponent} from './modulos/libros-publico/libro-detalle.component';
// ── Usuario ──────────────────────────────────────
import {ProfileComponent} from './modulos/usuario/perfil.component';
import {MisPrestamosComponent} from './modulos/usuario/mis-prestamos.component';
import {MisMultasComponent} from './modulos/usuario/mis-multas.component';
import {MisReservasComponent} from './modulos/usuario/mis-reservas.component';
import {MisFavoritosComponent} from './modulos/usuario/mis-favoritos.component';
import {MisResenasComponent} from './modulos/usuario/mis-resenas.component';

// ── Admin — dashboard + solo admin ───────────────
import {DashboardComponent} from './modulos/admin/dashboard.component';
import {AdminUsuariosComponent} from './modulos/admin/usuarios.component';
import {AdminRolesComponent} from './modulos/admin/roles.component';
import {ConfiguracionMultaComponent} from './modulos/admin/configuracion-multa.component';

// ── Admin + bibliotecario ────────────────────────
import {AdminLibrosComponent} from './modulos/admin/libros.component';
import {AdminEjemplaresComponent} from './modulos/admin/ejemplares.component';
import {AdminPrestamosComponent} from './modulos/admin/prestamos.component';
import {AdminMultasComponent} from './modulos/admin/multas.component';
import {AdminPagosComponent} from './modulos/admin/pagos.component';
import {AdminReservasComponent} from './modulos/admin/reservas.component';
import {AdminAutoresComponent} from './modulos/admin/autores.component';
import {AdminCategoriasComponent} from './modulos/admin/categorias.component';
import {AdminEditorialesComponent} from './modulos/admin/editoriales.component';
import {AdminRecursosDigitalesComponent} from './modulos/admin/recursos-digitales.component';
import {AdminHistorialComponent} from './modulos/admin/historial.component';

const routes: Routes = [
  {path: 'inicio', component: InicioComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'catalogo', component: CatalogoListadoComponent},
  {path: 'catalogo/:id', component: LibroDetalleComponent},

  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'mis-prestamos', component: MisPrestamosComponent, canActivate: [AuthGuard]},
  {path: 'mis-multas', component: MisMultasComponent, canActivate: [AuthGuard]},
  {path: 'mis-reservas', component: MisReservasComponent, canActivate: [AuthGuard]},
  {path: 'mis-favoritos', component: MisFavoritosComponent, canActivate: [AuthGuard]},
  {path: 'mis-resenas', component: MisResenasComponent, canActivate: [AuthGuard]},

  {path: 'admin/libros', component: AdminLibrosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/ejemplares', component: AdminEjemplaresComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/prestamos', component: AdminPrestamosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/multas', component: AdminMultasComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/pagos', component: AdminPagosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/reservas', component: AdminReservasComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/autores', component: AdminAutoresComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/categorias', component: AdminCategoriasComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/editoriales', component: AdminEditorialesComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/recursos-digitales', component: AdminRecursosDigitalesComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},
  {path: 'admin/historial', component: AdminHistorialComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin', 'bibliotecario']}},

  {path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin']}},
  {path: 'admin/usuarios', component: AdminUsuariosComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin']}},
  {path: 'admin/roles', component: AdminRolesComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin']}},
  {path: 'admin/configuracion-multa', component: ConfiguracionMultaComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['admin']}},

  {path: '', redirectTo: 'inicio', pathMatch: 'full'},
];

export default routes;
