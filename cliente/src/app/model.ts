export interface Rol {
  id: string; // uuid
  nombre: 'admin' | 'bibliotecario' | 'estudiante' | 'docente';
  descripcion?: string;
  creadoEn: string; // timestamptz (ISO 8601)
}

export interface Usuario {
  id: string;
  rolId: string; // uuid -> rol.id
  nombre?: string;
  apellidos?: string;
  dni?: string;
  correo?: string;
  creadoEn: string;
}

export interface Autor {
  id: string; // uuid
  nombre?: string;
  apellidos: string;
  nacionalidad?: string;
  biografia?: string;
  fotoUrl?: string;
  fechaNacimiento?: string;
  creadoEn: string;
}
export interface Categoria {
  id: string; // uuid
  nombre: string;
  padreId?: string; // uuid -> categoria.id (autorreferencia)
  activa: boolean;
  creadoEn: string;
}
export interface Editorial {
  id: string; // uuid
  nombre?: string;
  pais?: string;
  creadoEn: string;
}
export interface Libro {
  id: string; // uuid
  titulo: string;
  isbn?: string;
  editorialId: string; // uuid -> editorial.id
  anioPublicacion?: number;
  idioma?: string;
  descripcion?: string;
  busquedaFts?: string; // tsvector generado por Postgres, normalmente no se usa en frontend
  publicado: boolean;
  creadoEn: string;
}

// ─── recurso_digital ──────────────────────────────────────────────────────
export interface RecursoDigital {
  id: string; // uuid
  libroId: string; // uuid -> libro.id
  tipo: 'pdf' | 'epub' | 'audiolibro' | 'video';
  url: string;
  formato?: 'pdf' | 'epub' | 'mp3' | 'mp4';
  tamanioMb?: number;
  duracionMinutos?: number; // solo para audiolibro
  tipoAcceso?: 'publico' | 'autenticado' | 'restringido';
  creadoEn: string;
}

// ─── ejemplar ───────────────────────────────────────────────────────────
export interface Ejemplar {
  id: string; // uuid
  libroId: string; // uuid -> libro.id
  codigoBarras: string;
  estado: 'disponible' | 'prestado' | 'perdido' | 'mantenimiento';
  ubicacion?: string; // ej: "Estante A-12"
  fechaAdquisicion?: string; // date
  creadoEn: string;
}

// ─── libro_autor (tabla puente) ───────────────────────────────────────────
export interface LibroAutor {
  libroId: string; // uuid -> libro.id
  autorId: string; // uuid -> autor.id
}

// ─── libro_categoria (tabla puente) ───────────────────────────────────────
export interface LibroCategoria {
  libroId: string; // uuid -> libro.id
  categoriaId: string; // uuid -> categoria.id
}

// ─── prestamo ───────────────────────────────────────────────────────────
export interface Prestamo {
  id: string; // uuid
  usuarioId: string; // -> usuario.id
  ejemplarId: string; // uuid -> ejemplar.id
  fechaMaxDevolucion: string; // timestamptz
  fechaDevolucion?: string; // null = aún no devuelto
  estado: 'activo' | 'devuelto' | 'vencido';
  creadoEn: string;
}

// ─── multa ──────────────────────────────────────────────────────────────
export interface Multa {
  id: string; // uuid
  prestamoId: string; // uuid -> prestamo.id (unique)
  monto: number; // numeric(10,2)
  diasMora: number;
  estado: 'pendiente' | 'pagada' | 'perdonada';
  creadoEn: string;
}

// ─── pago_multa ─────────────────────────────────────────────────────────
export interface PagoMulta {
  id: string; // uuid
  multaId: string; // uuid -> multa.id
  montoPagado: number; // numeric(10,2)
  metodoPago: 'efectivo' | 'transferencia' | 'tarjeta';
  creadoEn: string;
}

// ─── reserva ────────────────────────────────────────────────────────────
export interface Reserva {
  id: string; // uuid
  usuarioId: string; // -> usuario.id
  libroId: string; // uuid -> libro.id
  fechaExpiracion: string; // timestamptz
  estado: 'pendiente' | 'activa' | 'cancelada' | 'completada';
  creadoEn: string;
}

// ─── configuracion_multa ───────────────────────────────────────────────
export interface ConfiguracionMulta {
  id: string; // uuid
  tarifaDiaria: number; // numeric(10,2)
  diasMaxPrestamo: number;
  creadoEn: string;
}

// ─── resena ─────────────────────────────────────────────────────────────
export interface Resena {
  id: string; // uuid
  usuarioId: string; // -> usuario.id
  libroId: string; // uuid -> libro.id
  puntuacion?: number; // 1-5
  comentario?: string;
  creadoEn: string;
}

// ─── historial ──────────────────────────────────────────────────────────
export interface Historial {
  id: string; // uuid
  nombreAccion: string; // ej: PRESTAMO_CREADO, MULTA_GENERADA, LIBRO_DEVUELTO
  accion: string;
  hechoPor: string; // -> usuario.id
  modulo?: string;
  ipUsuario?: string;
  creadoEn: string;
}

// ─── favorito ───────────────────────────────────────────────────────────
export interface Favorito {
  id: string; // uuid
  usuarioId: string; // -> usuario.id
  libroId: string; // uuid -> libro.id
  creadoEn: string;
}
