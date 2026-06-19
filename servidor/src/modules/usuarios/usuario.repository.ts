import { prisma } from '../prisma';
import { CreateUsuarioDto, UpdateUsuarioDto } from './usuario.dto';

export const usuarioRepository = {
    obtenerTodos() {
        return prisma.usuario.findMany({
            omit: { passwordHash: true },
        });
    },
    obtenerPorId(id: string) {
        return prisma.usuario.findUnique({
            where: { id },
            omit: { passwordHash: true },
        });
    },
    obtenerPorCorreoConHash(correo: string) {
        return prisma.usuario.findUnique({ where: { correo } });
    },
    crear(data: Omit<CreateUsuarioDto, 'password'> & { passwordHash?: string }) {
        return prisma.usuario.create({ data });
    },
    actualizar(id: string, data: Omit<UpdateUsuarioDto, 'password'> & { passwordHash?: string }) {
        return prisma.usuario.update({ where: { id }, data });
    },

    eliminar(id: string) {
        return prisma.usuario.delete({ where: { id } });
    },
};