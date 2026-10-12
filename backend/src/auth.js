import jwt from 'jsonwebtoken';
import { config } from './config.js';

export function signToken(user) {
  return jwt.sign({ sub: user.id_usuario }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

/** Datos del usuario que sí se pueden enviar al cliente (nunca el hash). */
export function publicUser(row) {
  return { id: row.id_usuario, nombre: row.nombre, email: row.email, moneda: row.moneda };
}
