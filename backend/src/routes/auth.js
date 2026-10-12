import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { validateRegister } from '../validators.js';
import { signToken, publicUser } from '../auth.js';
import { requireAuth } from '../middleware/requireAuth.js';

const CREDENCIALES_INCORRECTAS = 'Correo o contraseña incorrectos';
// Hash de relleno: se compara aunque el correo no exista para que el tiempo de respuesta
// no delate qué correos están registrados.
const DUMMY_HASH = bcrypt.hashSync('relleno-no-es-una-contraseña-real', 12);

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

  // HU02 — Inicio de sesión
  router.post('/login', async (req, res, next) => {
    try {
      const email = String(req.body?.email ?? '')
        .trim()
        .toLowerCase();
      const password = String(req.body?.password ?? '');
      const errors = {};
      if (!email) errors.email = 'Este campo es obligatorio';
      if (!password) errors.password = 'Este campo es obligatorio';
      if (Object.keys(errors).length > 0) {
        return res.status(422).json({ message: 'Revisa los campos marcados', errors });
      }

      const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      const user = rows[0];
      const passwordOk = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
      if (!user || !passwordOk) {
        // Mismo mensaje para correo inexistente y contraseña incorrecta
        return res.status(401).json({ message: CREDENCIALES_INCORRECTAS });
      }
      return res.json({ token: signToken(user), user: publicUser(user) });
    } catch (err) {
      return next(err);
    }
  });

  // HU02 — Sesión vigente (la app la consulta al abrir para saltarse el login)
  router.get('/me', requireAuth(db), (req, res) => {
    res.json({ user: publicUser(req.user) });
  });

  return router;
}
