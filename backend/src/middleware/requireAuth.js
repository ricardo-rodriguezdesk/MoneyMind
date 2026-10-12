import { verifyToken } from '../auth.js';

/** Exige sesión: lee el token "Bearer" y deja el usuario en req.user. */
export function requireAuth(db) {
  return async (req, res, next) => {
    try {
      const header = req.get('Authorization') ?? '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: 'Inicia sesión para continuar' });

      let payload;
      try {
        payload = verifyToken(token);
      } catch {
        return res.status(401).json({ message: 'Tu sesión expiró, inicia sesión de nuevo' });
      }
      const [rows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [payload.sub]);
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Tu sesión expiró, inicia sesión de nuevo' });
      }
      req.user = rows[0];
      return next();
    } catch (err) {
      return next(err);
    }
  };
}
