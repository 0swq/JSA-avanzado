import {prisma} from '../prisma';
import {CrearLibroDto, ActualizarLibroDto} from './libro.dto';

export const libroRepositorio = {
    obtenerTodos(filtros: {
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
        const where: any = {};

        if (filtros.titulo) where.titulo = {contains: filtros.titulo, mode: 'insensitive'};
        if (filtros.isbn) where.isbn = {contains: filtros.isbn, mode: 'insensitive'};
        if (filtros.editorialId) where.editorialId = filtros.editorialId;
        if (filtros.publicado !== undefined) where.publicado = filtros.publicado;
        if (filtros.anioPublicacion) where.anioPublicacion = filtros.anioPublicacion;
        if (filtros.autorId) where.autores = {some: {autorId: filtros.autorId}};
        if (filtros.categoriaId) where.categorias = {some: {categoriaId: filtros.categoriaId}};

        const pagina = filtros.pagina ?? 1;
        const porPagina = filtros.porPagina ?? 10;

        return prisma.libro.findMany({
            where,
            include: {
                editorial: true,
                autores: {include: {autor: true}},
                categorias: {include: {categoria: true}},
                ejemplares: {select: {id: true, codigoBarras: true, estado: true}},
            },
            orderBy: {creadoEn: 'desc'},
            skip: (pagina - 1) * porPagina,
            take: porPagina,
        });
    },

    obtenerPorId(id: string) {
        return prisma.libro.findUnique({
            where: {id},
            include: {
                editorial: true,
                autores: {include: {autor: true}},
                categorias: {include: {categoria: true}},
                ejemplares: {select: {id: true, codigoBarras: true, estado: true}},
                recursosDigitales: true,
            },
        });
    },

    crear(data: CrearLibroDto) {
        return prisma.libro.create({
            data,
            include: {
                editorial: true,
                autores: {include: {autor: true}},
                categorias: {include: {categoria: true}},
            },
        });
    },

    actualizar(id: string, data: ActualizarLibroDto) {
        return prisma.libro.update({
            where: {id},
            data,
            include: {
                editorial: true,
                autores: {include: {autor: true}},
                categorias: {include: {categoria: true}},
            },
        });
    },

    eliminar(id: string) {
        return prisma.libro.delete({where: {id}});
    },

    async buscar(termino: string, pagina = 1, porPagina = 10) {
        const offset = (pagina - 1) * porPagina;

        const [data, total] = await Promise.all([
            prisma.$queryRaw<any[]>`
                SELECT l.*,
                       ts_rank(l.busqueda_fts, plainto_tsquery('spanish', ${termino})) as rank
                FROM "libro" l
                WHERE l.busqueda_fts @@ plainto_tsquery('spanish'
                    , ${termino})
                ORDER BY rank DESC
                    LIMIT ${porPagina}
                OFFSET ${offset}
            `,
            prisma.$queryRaw<[{ count: bigint }]>`
                SELECT COUNT(*) as count
                FROM "libro"
                WHERE busqueda_fts @@ plainto_tsquery('spanish', ${termino})
            `,
        ]);

        return {
            data,
            total: Number(total[0].count),
            pagina,
            porPagina,
            totalPaginas: Math.ceil(Number(total[0].count) / porPagina),
        };
    },
};


