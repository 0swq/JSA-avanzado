import { Environment } from './environment.interface';

/**
 * 📋  EJEMPLO — Copia este archivo como `environment.ts` y ajusta los valores.
 *
 *     Este archivo se commitea como referencia. No contiene secretos reales.
 *
 * Uso:
 *   cp src/environments/environment.example.ts src/environments/environment.ts
 *
 * Los endpoints reflejan los 17 módulos del backend Express + Prisma.
 * Las rutas son relativas a `apiUrl`. El prefijo de cada módulo coincide
 * con lo definido en servidor/app.ts:
 *
 *   /api/auth, /api/usuarios, /api/roles, /api/autores, /api/categorias,
 *   /api/editoriales, /api/libros, /api/recursos-digitales, /api/ejemplares,
 *   /api/prestamos, /api/multas, /api/pagos-multa, /api/reservas,
 *   /api/configuracion-multa, /api/resenas, /api/historial, /api/favoritos
 *
 * Proyecto de fines educativos — solo entorno de desarrollo local.
 */
export const environment: Environment = {
  /** URL base de la API sin barra final. Ajusta el host y puerto según tu entorno. */
  apiUrl: 'http://localhost:3000/api',

  appName: 'Biblioteca JSA',
  version: '1.0.0',
  defaultLanguage: 'es',

  endpoints: {
    // ── Auth (3 endpoints) ──────────────────────────────
    auth: {
      login:    '/auth/login',     // ✅ POST — body: { correo, password }
      registro: '/auth/registro',   // ✅ POST — body: { rolId, nombre, apellidos, dni, correo, password }
      perfil:   '/auth/perfil',     // ✅ GET  — header: Authorization: Bearer <token>
    },

    // ── Usuarios (5 endpoints) ──────────────────────────
    usuarios: {
      listar:     '/usuarios',      // ✅ GET    — admin, bibliotecario
      obtener:    '/usuarios',      // ✅ GET    — /:id  (admin, bibliotecario)
      crear:      '/usuarios',      // ✅ POST   — admin
      actualizar: '/usuarios',      // ✅ PATCH  — /:id  (admin)
      eliminar:   '/usuarios',      // ✅ DELETE — /:id  (admin)
    },

    // ── Roles (5 endpoints) ─────────────────────────────
    roles: {
      listar:     '/roles',        // ✅ GET    — admin
      obtener:    '/roles',        // ✅ GET    — /:id  (admin)
      crear:      '/roles',        // ✅ POST   — admin
      actualizar: '/roles',        // ✅ PATCH  — /:id  (admin)
      eliminar:   '/roles',         // ✅ DELETE — /:id  (admin)
    },

    // ── Autores (5 endpoints) ───────────────────────────
    autores: {
      listar:     '/autores',      // ✅ GET    — público
      obtener:    '/autores',      // ✅ GET    — /:id  (público)
      crear:      '/autores',      // ✅ POST   — admin, bibliotecario
      actualizar: '/autores',       // ✅ PATCH  — /:id  (admin, bibliotecario)
      eliminar:   '/autores',       // ✅ DELETE — /:id  (admin, bibliotecario)
    },

    // ── Categorías (5 endpoints) ────────────────────────
    categorias: {
      listar:     '/categorias',    // ✅ GET    — público (soporta jerarquía padre/hijas)
      obtener:    '/categorias',    // ✅ GET    — /:id  (público)
      crear:      '/categorias',    // ✅ POST   — admin, bibliotecario
      actualizar: '/categorias',    // ✅ PATCH  — /:id  (admin, bibliotecario)
      eliminar:   '/categorias',    // ✅ DELETE — /:id  (admin, bibliotecario)
    },

    // ── Editoriales (5 endpoints) ───────────────────────
    editoriales: {
      listar:     '/editoriales',   // ✅ GET    — público
      obtener:    '/editoriales',   // ✅ GET    — /:id  (público)
      crear:      '/editoriales',   // ✅ POST   — admin, bibliotecario
      actualizar: '/editoriales',   // ✅ PATCH  — /:id  (admin, bibliotecario)
      eliminar:   '/editoriales',   // ✅ DELETE — /:id  (admin, bibliotecario)
    },

    // ── Libros (5 endpoints) ────────────────────────────
    libros: {
      listar:     '/libros',       // ✅ GET    — público (query: titulo, isbn, autorId, categoriaId, editorialId, publicado, anioPublicacion)
      obtener:    '/libros',       // ✅ GET    — /:id  (público, respuesta incluye autores, categorías, editorial, ejemplares, recursos digitales)
      crear:      '/libros',       // ✅ POST   — admin, bibliotecario
      actualizar: '/libros',       // ✅ PATCH  — /:id  (admin, bibliotecario)
      eliminar:   '/libros',       // ✅ DELETE — /:id  (admin, bibliotecario)
    },

    // ── Recursos Digitales (6 endpoints) ────────────────
    recursosDigitales: {
      listar:     '/recursos-digitales',         // ✅ GET — público
      obtener:    '/recursos-digitales',         // ✅ GET — /:id  (público)
      crear:      '/recursos-digitales',         // ✅ POST — admin, bibliotecario
      actualizar: '/recursos-digitales',         // ✅ PATCH — /:id  (admin, bibliotecario)
      eliminar:   '/recursos-digitales',         // ✅ DELETE — /:id  (admin, bibliotecario)
      porLibro:   '/recursos-digitales/libro',   // ✅ GET — /libro/:libroId  (público)
    },

    // ── Ejemplares (6 endpoints) ────────────────────────
    ejemplares: {
      listar:     '/ejemplares',        // ✅ GET — admin, bibliotecario
      obtener:    '/ejemplares',        // ✅ GET — /:id  (admin, bibliotecario)
      crear:      '/ejemplares',        // ✅ POST — admin, bibliotecario
      actualizar: '/ejemplares',        // ✅ PATCH — /:id  (admin, bibliotecario)
      eliminar:   '/ejemplares',        // ✅ DELETE — /:id  (admin, bibliotecario)
      porLibro:   '/ejemplares/libro',   // ✅ GET — /libro/:libroId  (admin, bibliotecario)
    },

    // ── Préstamos (5 endpoints + mis-prestamos) ─────────
    prestamos: {
      listar:       '/prestamos',                    // ✅ GET — admin, bibliotecario (query: estado, usuarioId, ejemplarId)
      obtener:      '/prestamos',                    // ✅ GET — /:id  (admin, bibliotecario; docente/estudiante solo propios)
      crear:        '/prestamos',                    // ✅ POST — admin, bibliotecario
      actualizar:   '/prestamos',                    // ✅ PATCH — /:id  (admin, bibliotecario — ej. registrar devolución)
      eliminar:     '/prestamos',                    // ⚠️ DELETE — /:id  (verificar si existe en backend)
      misPrestamos: '/prestamos/mis-prestamos',      // ✅ GET — todos los roles autenticados
    },

    // ── Multas (5 endpoints + mis-multas) ───────────────
    multas: {
      listar:     '/multas',               // ✅ GET — admin, bibliotecario
      obtener:    '/multas',               // ✅ GET — /:id  (admin, bibliotecario)
      crear:      '/multas',               // ✅ POST — admin, bibliotecario
      actualizar: '/multas',               // ✅ PATCH — /:id  (admin, bibliotecario)
      eliminar:   '/multas',               // ⚠️ DELETE — /:id  (verificar si existe en backend)
      misMultas:  '/multas/mis-multas',     // ✅ GET — todos los roles autenticados
    },

    // ── Pagos de Multa (5 endpoints + porMulta) ─────────
    pagosMulta: {
      listar:     '/pagos-multa',           // ✅ GET — admin, bibliotecario
      obtener:    '/pagos-multa',           // ✅ GET — /:id  (admin, bibliotecario)
      crear:      '/pagos-multa',           // ✅ POST — admin, bibliotecario
      actualizar: '/pagos-multa',           // ✅ PATCH — /:id  (admin, bibliotecario)
      eliminar:   '/pagos-multa',           // ⚠️ DELETE — /:id  (verificar si existe en backend)
      porMulta:   '/pagos-multa/multa',     // ✅ GET — /multa/:multaId  (admin, bibliotecario)
    },

    // ── Reservas (6 endpoints + mis-reservas + cancelar) ─
    reservas: {
      listar:      '/reservas',                 // ✅ GET — admin, bibliotecario
      obtener:     '/reservas',                 // ✅ GET — /:id  (admin, bibliotecario)
      crear:       '/reservas',                 // ✅ POST — todos (límite 3 activas por usuario)
      actualizar:  '/reservas',                 // ✅ PATCH — /:id  (admin, bibliotecario)
      eliminar:    '/reservas',                 // ✅ DELETE — /:id  (admin, bibliotecario — cancelar reserva)
      cancelar:    '/reservas',                 // ✅ DELETE — /:id  (alias semántico, misma ruta que eliminar)
      misReservas: '/reservas/mis-reservas',    // ✅ GET — todos los roles autenticados
    },

    // ── Configuración de Multa (4 endpoints) ────────────
    configuracionMulta: {
      listar:     '/configuracion-multa', // ✅ GET    — admin, bibliotecario (devuelve la config actual)
      obtener:    '/configuracion-multa', // ✅ GET    — /:id  (admin, bibliotecario)
      crear:      '/configuracion-multa', // ✅ POST   — admin
      actualizar: '/configuracion-multa', // ✅ PATCH  — /:id  (admin)
      eliminar:   '/configuracion-multa', // ⚠️ DELETE — /:id  (verificar si existe en backend)
    },

    // ── Reseñas (6 endpoints + porLibro + mis-resenas) ──
    resenas: {
      listar:     '/resenas',                 // ✅ GET — público (⚠️ verificar; puede requerir /libro/:libroId)
      obtener:    '/resenas',                 // ✅ GET — /:id  (todos)
      crear:      '/resenas',                 // ✅ POST — todos
      actualizar: '/resenas',                 // ✅ PATCH — /:id  (todos, solo propia)
      eliminar:   '/resenas',                 // ✅ DELETE — /:id  (admin, bibliotecario)
      porLibro:   '/resenas/libro',           // ✅ GET — /libro/:libroId  (público)
      misResenas: '/resenas/mis-resenas',     // ✅ GET — todos los roles autenticados
    },

    // ── Historial (3 endpoints, sin PATCH) ──────────────
    historial: {
      listar:  '/historial',  // ✅ GET  — admin, bibliotecario (query: hechoPorId, modulo, nombreAccion, desde, hasta)
      obtener: '/historial',  // ✅ GET  — /:id  (admin, bibliotecario)
      crear:   '/historial',  // ✅ POST — admin, bibliotecario
    },

    // ── Favoritos (4 endpoints, sin PATCH) ──────────────
    favoritos: {
      misFavoritos: '/favoritos/mis-favoritos', // ✅ GET    — todos los roles autenticados
      obtener:      '/favoritos',               // ✅ GET    — /:id  (todos)
      agregar:      '/favoritos',               // ✅ POST   — todos
      eliminar:     '/favoritos',               // ✅ DELETE — /:id  (todos)
    },

    // ── Test (legacy, 4 endpoints) 📦 ─────────────────────
    test: {
      all:   '/test/all',    // 📦 GET — público (NO existe en backend real)
      user:  '/test/user',   // 📦 GET — autenticados (NO existe en backend real)
      mod:   '/test/mod',    // 📦 GET — moderadores (NO existe en backend real)
      admin: '/test/admin',  // 📦 GET — admin (NO existe en backend real)
    },
  },
};
