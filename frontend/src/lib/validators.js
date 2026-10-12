// Mismas reglas que backend/src/validators.js (la API siempre vuelve a validar)
export const MONEDAS = [
  { code: 'MXN', label: 'Peso mexicano (MXN)' },
  { code: 'USD', label: 'Dólar estadounidense (USD)' },
  { code: 'EUR', label: 'Euro (EUR)' },
];

export const validators = {
  nombre(value) {
    const nombre = value.trim();
    const ok = nombre.length >= 2 && nombre.length <= 100 && /^[\p{L}][\p{L}\s'.-]*$/u.test(nombre);
    return ok ? '' : 'Ingresa tu nombre (mínimo 2 letras)';
  },
  email(value) {
    const email = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 150
      ? ''
      : 'Correo no válido';
  },
  password(value) {
    const ok = value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
    return ok ? '' : 'Mínimo 8 caracteres, con letras y números';
  },
};
