// Reglas de validación compartidas (HU01 registro, HU03 nueva contraseña, HU04 gastos)

export const MONEDAS = ['MXN', 'USD', 'EUR'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NOMBRE_REGEX = /^[\p{L}][\p{L}\s'.-]*$/u;

/** Cada validador regresa un mensaje de error o null si el dato es válido. */
export function validateNombre(value) {
  const nombre = String(value ?? '').trim();
  if (nombre.length < 2 || nombre.length > 100 || !NOMBRE_REGEX.test(nombre)) {
    return 'Ingresa tu nombre (mínimo 2 letras)';
  }
  return null;
}

export function validateEmail(value) {
  const email = String(value ?? '').trim();
  if (!EMAIL_REGEX.test(email) || email.length > 150) return 'Correo no válido';
  return null;
}

export function validatePassword(value) {
  const password = String(value ?? '');
  const ok = password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  return ok ? null : 'Mínimo 8 caracteres, con letras y números';
}

export function validateMoneda(value) {
  return MONEDAS.includes(value) ? null : 'Moneda no válida';
}

/** Valida el formulario de registro. Regresa { errors, data }. */
export function validateRegister(body = {}) {
  const moneda = body.moneda ? String(body.moneda).toUpperCase() : 'MXN'; // MXN por defecto
  const errors = {};
  const checks = {
    nombre: validateNombre(body.nombre),
    email: validateEmail(body.email),
    password: validatePassword(body.password),
    moneda: validateMoneda(moneda),
  };
  for (const [field, message] of Object.entries(checks)) {
    if (message) errors[field] = message;
  }
  return {
    errors,
    data: {
      nombre: String(body.nombre ?? '').trim(),
      email: String(body.email ?? '')
        .trim()
        .toLowerCase(),
      password: String(body.password ?? ''),
      moneda,
    },
  };
}
