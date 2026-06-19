
export interface CreateUsuarioDto {
    rolId: string;
    nombre?: string;
    apellidos?: string;
    dni?: string;
    correo?: string;
    password?: string;
}

export interface UpdateUsuarioDto {
    rolId?: string;
    nombre?: string;
    apellidos?: string;
    dni?: string;
    correo?: string;
    password?: string;
}


export interface UsuarioResponseDto {
    id: string;
    rolId: string;
    nombre: string | null;
    apellidos: string | null;
    dni: string | null;
    correo: string | null;
    creadoEn: Date;
}