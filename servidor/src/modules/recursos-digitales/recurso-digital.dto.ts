export interface CrearRecursoDigitalDto {
  libroId: string;
  tipo: string;
  url: string;
  formato?: string;
  tamanioMb?: number;
  duracionMinutos?: number;
  tipoAcceso?: string;
}

export interface ActualizarRecursoDigitalDto {
  libroId?: string;
  tipo?: string;
  url?: string;
  formato?: string;
  tamanioMb?: number;
  duracionMinutos?: number;
  tipoAcceso?: string;
}

export interface RespuestaRecursoDigitalDto {
  id: string;
  libroId: string;
  tipo: string;
  url: string;
  formato: string | null;
  tamanioMb: number | null;
  duracionMinutos: number | null;
  tipoAcceso: string | null;
  creadoEn: Date;
}
