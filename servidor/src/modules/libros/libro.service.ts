import {ApiError} from '@utils/ApiError';
import {CrearLibroDto, ActualizarLibroDto, RespuestaLibroDto} from './libro.dto';
import {libroRepositorio} from './libro.repository';
import {iaServicio} from "@modules/ia/ia.service";

export const libroServicio = {
    async obtenerTodos(filtros: {
        titulo?: string;
        isbn?: string;
        editorialId?: string;
        autorId?: string;
        categoriaId?: string;
        publicado?: boolean;
        anioPublicacion?: number;
        pagina?: number;
        porPagina?: number;
    } = {}) {
        const pagina = filtros.pagina ?? 1;
        const porPagina = filtros.porPagina ?? 10;
        const data = await libroRepositorio.obtenerTodos(filtros);
        return {data, pagina, porPagina};
    },

    async obtenerPorId(id: string): Promise<RespuestaLibroDto> {
        const libro = await libroRepositorio.obtenerPorId(id);
        if (!libro) throw ApiError.noEncontrado('Libro no encontrado');
        return libro;
    },

    crear(data: CrearLibroDto): Promise<RespuestaLibroDto> {
        return libroRepositorio.crear(data);
    },

    async actualizar(id: string, data: ActualizarLibroDto): Promise<RespuestaLibroDto> {
        await this.obtenerPorId(id);
        return libroRepositorio.actualizar(id, data);
    },

    async eliminar(id: string): Promise<void> {
        await this.obtenerPorId(id);
        await libroRepositorio.eliminar(id);
    },

    async buscar(termino: string, pagina = 1, porPagina = 10) {
        const respuesta = await iaServicio.completar(
            `Dado un término de búsqueda para una biblioteca, devuelve SOLO un JSON con una gran cantidad de palabras clave relacionadas.
         Formato estricto: { "terminos": ["palabra1", "palabra2", "palabra3"] }
         Sin explicaciones ni markdown.`,
            termino
        );
        const {terminos} = JSON.parse(respuesta) as { terminos: string[] };
        const terminoMejorado = [...terminos, termino]
            .join(' ')
            .replace(/[^\w\sáéíóúñü]/gi, '');

        return libroRepositorio.buscar(terminoMejorado, pagina, porPagina);
    },
};