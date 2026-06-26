// @ts-nocheck
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
        const porPagina = filtros.porPagina; // undefined = sin límite
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

    async solicitarGrafo(termino: string) {
        const resultado = await this.buscar(termino, 1, 50);
        const libros = resultado.data;

        if (!libros || libros.length === 0) {
            return {nodes: [], edges: []};
        }
        const librosFormateados = libros.map((l: any) => ({
            id: l.id,
            titulo: l.titulo,
            descripcion: l.descripcion ?? '',
            isbn: l.isbn ?? '',
            anio: l.anioPublicacion ?? '',
            idioma: l.idioma ?? '',
            editorial: l.editorial?.nombre ?? '',
            autores: (l.autores ?? []).map((a: any) =>
                `${a.autor?.nombre ?? ''} ${a.autor?.apellidos ?? ''}`.trim()
            ),
            categorias: (l.categorias ?? []).map((c: any) => c.categoria?.nombre ?? ''),
        }));
        const sistema = `Eres un asistente experto en bibliotecas universitarias y análisis de conocimiento.

Tu tarea es analizar una consulta de investigación de un estudiante y un conjunto de libros disponibles en una biblioteca.

Debes:
1. Evaluar qué libros son más relevantes para resolver la necesidad del estudiante.
2. Asignar una puntuación de relevancia del 0 al 100 a cada libro.
3. Explicar brevemente por qué cada libro puede ayudar.
4. Crear relaciones entre libros o temas cuando exista una conexión conceptual.
5. Generar un grafo de conocimiento en formato JSON compatible con Vis Network.

Reglas:
- No inventes libros que no estén en la lista.
- Usa únicamente la información proporcionada.
- La relevancia debe basarse en la relación entre la solicitud del usuario y la descripción del libro.
- Máximo 3 niveles de profundidad en las relaciones.
- Devuelve únicamente JSON válido, sin explicaciones adicionales.

Formato de salida obligatorio:

{
  "nodes": [],
  "edges": []
}

Estructura de nodo:

{
  "id": "id_del_libro",
  "label": "titulo",
  "group": "libro",
  "value": relevancia,
  "data": {
    "razon": "motivo de recomendación"
  }
}

Estructura de conexión:

{
  "from": "id_origen",
  "to": "id_destino"
}`;

        const prompt = `Consulta de investigación: "${termino}"

Libros disponibles:
${JSON.stringify(librosFormateados, null, 2)}`;

        // 4. Llamar a la IA
        const respuesta = await iaServicio.completar(sistema, prompt);
        console.log('[IA grafo respuesta]:', respuesta.substring(0, 400));

        // 5. Extraer JSON de la respuesta (la IA puede envolverlo en markdown)
        const match = respuesta.match(/\{[\s\S]*\}/);
        if (!match) {
            console.error('[IA grafo] No se encontró JSON en la respuesta');
            return {nodes: [], edges: []};
        }

        const {nodes, edges} = JSON.parse(match[0]) as { nodes: any[]; edges: any[] };
        console.log('[IA grafo] nodes:', nodes?.length, 'edges:', edges?.length);

        return {nodes: nodes ?? [], edges: edges ?? []};
    },

    async buscar(termino: string, pagina = 1, porPagina = 10) {
        let terminoMejorado = termino.replace(/[^\w\sáéíóúñü]/gi, '');
        try {
            const respuesta = await iaServicio.completar(
                `Eres un asistente de búsqueda para una biblioteca. El usuario buscará un tema o concepto ESPECÍFICO.
         Tu tarea es expandir ese término con sinónimos, subtemas y conceptos ESTRECHAMENTE RELACIONADOS al tema exacto que el usuario busca.
         NO incluyas términos genéricos de la categoría padre ni temas tangenciales.
         Ejemplo: si buscan "java", devuelve términos como "jvm", "spring boot", "jakarta ee", "maven", "gradle", NO "python", "javascript", "programación".
         Ejemplo: si buscan "cálculo", devuelve "derivadas", "integrales", "límites", NO "álgebra", "estadística".
         Devuelve SOLO un JSON. Formato estricto: { "terminos": ["palabra1", "palabra2", ...] }
         Sin explicaciones ni markdown.`,
                termino
            );
            console.log('[IA respuesta cruda]:', respuesta);
            const {terminos} = JSON.parse(respuesta) as { terminos: string[] };
            console.log('[IA términos extraídos]:', terminos);
            terminoMejorado = [...terminos, termino]
                .join(' ')
                .replace(/[^\w\sáéíóúñü]/gi, '');
            console.log('[IA término final para FTS]:', terminoMejorado);
        } catch (err: any) {
            console.warn('[IA] Falló la expansión, usando término original:', err.message);
        }
        return libroRepositorio.buscar(terminoMejorado, pagina, porPagina);
    },
};