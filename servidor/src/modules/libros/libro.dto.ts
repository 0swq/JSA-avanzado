// @ts-nocheck
export interface CrearLibroDto {
  titulo: string;
  isbn?: string;
  editorialId: string;
  anioPublicacion?: number;
  idioma?: string;
  publicado?: boolean;
}

export interface ActualizarLibroDto {
  titulo?: string;
  isbn?: string;
  editorialId?: string;
  anioPublicacion?: number;
  idioma?: string;
  publicado?: boolean;
}

export interface RespuestaLibroDto {
  id: string;
  titulo: string;
  isbn: string | null;
  editorialId: string;
  anioPublicacion: number | null;
  idioma: string | null;
  publicado: boolean;
  creadoEn: Date;
}
