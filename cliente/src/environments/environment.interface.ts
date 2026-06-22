/**
 * Interfaz tipada para la configuración de entornos.
 * Garantiza que tanto development como production tengan la misma estructura.
 *
 * Basado en el backend Express + Prisma con 17 módulos (85 endpoints).
 * El prefijo de cada módulo se define aquí; las rutas son relativas a `apiUrl`.
 *
 * Uso en servicios:
 *   const url = `${environment.apiUrl}${environment.endpoints.auth.login}`;
 */
export interface Environment {
  /** URL base de la API del backend (sin trailing slash). Ej: http://localhost:3000/api */
  apiUrl: string;

  /** Nombre visible de la aplicación */
  appName: string;

  /** Versión semántica de la aplicación (MAJOR.MINOR.PATCH) */
  version: string;

  /** Idioma por defecto (código ISO 639-1) */
  defaultLanguage: string;

  /** Endpoints de la API agrupados por módulo del backend */
  endpoints: EndpointsConfig;
}

// ──────────────────────────────────────────────
// MÓDULOS DEL BACKEND
// ──────────────────────────────────────────────

/** Configuración completa de endpoints — un sub-objeto por módulo del backend. */
export interface EndpointsConfig {
  auth: AuthEndpoints;
  usuarios: CrudEndpoints;
  roles: CrudEndpoints;
  autores: CrudEndpoints;
  categorias: CrudEndpoints;
  editoriales: CrudEndpoints;
  libros: CrudEndpoints;
  recursosDigitales: RecursosDigitalesEndpoints;
  ejemplares: EjemplaresEndpoints;
  prestamos: PrestamosEndpoints;
  multas: MultasEndpoints;
  pagosMulta: PagosMultaEndpoints;
  reservas: ReservasEndpoints;
  configuracionMulta: CrudEndpoints;
  resenas: ResenasEndpoints;
  historial: HistorialEndpoints;
  favoritos: FavoritosEndpoints;
  /** 📦 Endpoints de prueba del template legacy (no existen en el backend) */
  test: TestEndpoints;
}

export interface AuthEndpoints {
  /** POST /auth/login — body: { correo, password } → { token, usuario } */
  login: string;
  /** POST /auth/registro — body: { rolId, nombre, apellidos, dni, correo, password } */
  registro: string;
  /** GET /auth/perfil — header: Authorization: Bearer <token> */
  perfil: string;
}

export interface CrudEndpoints {
  /** GET /<modulo> — listar todos (paginado) */
  listar: string;
  /** GET /<modulo>/:id — obtener por ID */
  obtener: string;
  /** POST /<modulo> — crear nuevo recurso */
  crear: string;
  /** PATCH /<modulo>/:id — actualizar recurso existente */
  actualizar: string;
  /** DELETE /<modulo>/:id — eliminar recurso */
  eliminar: string;
}

export interface RecursosDigitalesEndpoints extends CrudEndpoints {
  /** GET /recursos-digitales/libro/:libroId — recursos de un libro específico */
  porLibro: string;
}

export interface EjemplaresEndpoints extends CrudEndpoints {
  /** GET /ejemplares/libro/:libroId — ejemplares de un libro específico */
  porLibro: string;
}


export interface PrestamosEndpoints extends CrudEndpoints {
  /** GET /prestamos/mis-prestamos — préstamos del usuario autenticado */
  misPrestamos: string;
}

export interface MultasEndpoints extends CrudEndpoints {
  /** GET /multas/mis-multas — multas del usuario autenticado */
  misMultas: string;
}

export interface PagosMultaEndpoints extends CrudEndpoints {
  /** GET /pagos-multa/multa/:multaId — pagos de una multa específica */
  porMulta: string;
}

export interface ReservasEndpoints extends CrudEndpoints {
  /** GET /reservas/mis-reservas — reservas del usuario autenticado */
  misReservas: string;
  /** DELETE /reservas/:id — cancelar reserva (alias semántico de eliminar) */
  cancelar: string;
}

export interface ResenasEndpoints extends CrudEndpoints {
  /** GET /resenas/libro/:libroId — reseñas de un libro específico */
  porLibro: string;
  /** GET /resenas/mis-resenas — reseñas del usuario autenticado */
  misResenas: string;
}

export interface HistorialEndpoints {
  /** GET /historial — listar registros de auditoría (con filtros por query string) */
  listar: string;
  /** GET /historial/:id — obtener registro de auditoría por ID */
  obtener: string;
  /** POST /historial — crear nuevo registro de auditoría */
  crear: string;
}


export interface FavoritosEndpoints {
  /** GET /favoritos/mis-favoritos — favoritos del usuario autenticado */
  misFavoritos: string;
  /** GET /favoritos/:id — obtener favorito por ID */
  obtener: string;
  /** POST /favoritos — agregar libro a favoritos */
  agregar: string;
  /** DELETE /favoritos/:id — quitar libro de favoritos */
  eliminar: string;
}

/**
 * 📦 Endpoints de prueba del template legacy.
 * Estos endpoints NO existen en el backend real.
 * Se conservan para compatibilidad con el código base original.
 */
export interface TestEndpoints {
  /** GET /api/test/all — contenido público (legacy) */
  all: string;
  /** GET /api/test/user — contenido para usuarios autenticados (legacy) */
  user: string;
  /** GET /api/test/mod — contenido para moderadores (legacy) */
  mod: string;
  /** GET /api/test/admin — contenido para administradores (legacy) */
  admin: string;
}
