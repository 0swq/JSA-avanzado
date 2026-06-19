// @ts-nocheck
import Joi from 'joi';

export const crearReservaSchema = Joi.object({
  usuarioId: Joi.string().required().messages({
    'any.required': 'El usuarioId es obligatorio',
  }),
  libroId: Joi.string().uuid().required().messages({
    'any.required': 'El libroId es obligatorio',
  }),
  fechaExpiracion: Joi.date().iso().required().messages({
    'any.required': 'La fecha de expiración es obligatoria',
  }),
});

export const actualizarReservaSchema = Joi.object({
  fechaExpiracion: Joi.date().iso().optional(),
  estado: Joi.string().valid('pendiente', 'activa', 'cancelada', 'completada').optional(),
}).min(1);

export const filtroReservaSchema = Joi.object({
  estado: Joi.string().valid('pendiente', 'activa', 'cancelada', 'completada').optional(),
  usuarioId: Joi.string().optional(),
  libroId: Joi.string().uuid().optional(),
});
