// @ts-nocheck
import bcrypt from 'bcrypt';


import {generarToken} from '@config/jwt';
import {ApiError} from '@utils/ApiError';
import {ActualizarUsuarioDto, CrearUsuarioDto} from "@modules/usuarios/usuario.dto";
import {usuarioRepositorio} from "@modules/usuarios/usuario.repository";

const SALT_ROUNDS = 10;

export const usuarioServicio = {
    obtenerTodos() {
        return usuarioRepositorio.obtenerTodos();
    },

    async obtenerPorId(id: string) {
        const usuario = await usuarioRepositorio.obtenerPorId(id);
        if (!usuario) throw ApiError.noEncontrado('Usuario no encontrado');
        return usuario;
    },

    async crear(data: CrearUsuarioDto) {
        const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
        return usuarioRepositorio.crear({...data, passwordHash});
    },

    async actualizar(id: string, data: ActualizarUsuarioDto) {
        await usuarioServicio.obtenerPorId(id);
        const passwordHash = data.password
            ? await bcrypt.hash(data.password, SALT_ROUNDS)
            : undefined;
        return usuarioRepositorio.actualizar(id, {...data, passwordHash});
    },

    async eliminar(id: string) {
        await usuarioServicio.obtenerPorId(id);
        return usuarioRepositorio.eliminar(id);
    },

    async login(correo: string, password: string) {
        const usuario = await usuarioRepositorio.obtenerPorCorreoConHash(correo);
        if (!usuario) throw ApiError.noAutorizado('Credenciales incorrectas');

        const esValido = await bcrypt.compare(password, usuario.passwordHash!);
        if (!esValido) throw ApiError.noAutorizado('Credenciales incorrectas');

        const token = generarToken({id: usuario.id, rolId: usuario.rolId, correo: usuario.correo!});
        const {passwordHash, ...usuarioSinHash} = usuario;
        return {token, usuario: usuarioSinHash};
    },
};