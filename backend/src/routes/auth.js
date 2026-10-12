import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { validateRegister } from '../validators.js';
import { signToken, publicUser } from '../auth.js';

export function authRoutes({ db }) {
  const router = Router();

  // HU01 — Registro de cuenta
  router.post('/register', async (req, res, next) => {
    try {
      const { errors, data } = validateRegister(req.body);
      if (Object.keys(errors).length > 0) {
        return res.status(422).json({ message: 'Revisa los campos marcados', errors });
      }

      const [existing] = await db.query('SELECT id_usuario FROM usuarios WHERE email = ?', [
        data.email,
      ]);
      if (existing.length > 0) {
        return res.status(409).json({
          message: 'Este correo ya está registrado',
          errors: { email: 'Este correo ya está registrado' },
        });
      }

      const passwordHash = await bcrypt.hash(data.password, 12);
      const [result] = await db.query(
        'INSERT INTO usuarios (nombre, email, password_hash, moneda) VALUES (?, ?, ?, ?)',
        [data.nombre, data.email, passwordHash, data.moneda]
      );
      const [rows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [
        result.insertId,
      ]);
      const user = rows[0];
      return res.status(201).json({ token: signToken(user), user: publicUser(user) });
    } catch (err) {
      // Dos registros simultáneos con el mismo correo: lo frena el UNIQUE de la BD
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          message: 'Este correo ya está registrado',
          errors: { email: 'Este correo ya está registrado' },
        });
      }
      return next(err);
    }
  });

  return router;
}
