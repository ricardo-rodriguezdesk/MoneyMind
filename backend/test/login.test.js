// HU02 — Testing: cada prueba corresponde a un paso de la tarjeta "Construir y probar el inicio de sesión"
import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestApp, cleanTables, validUser } from './helpers.js';

describe('HU02 · Inicio de sesión', () => {
  let app;
  let db;
  before(async () => ({ app, db } = await setupTestApp()));
  beforeEach(async () => {
    await cleanTables(db);
    await request(app).post('/api/auth/register').send(validUser);
  });
  after(() => db.end());

  it('Paso 1 · credenciales correctas → entra al dashboard en menos de 2 segundos', async () => {
    const inicio = Date.now();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });
    const ms = Date.now() - inicio;
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    assert.equal(res.body.user.nombre, validUser.nombre);
    assert.ok(ms < 2000, `tardó ${ms} ms`);
  });

  it('Paso 2 · correo no registrado → "Correo o contraseña incorrectos"', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nadie@ejemplo.com', password: validUser.password });
    assert.equal(res.status, 401);
    assert.equal(res.body.message, 'Correo o contraseña incorrectos');
    assert.equal(res.body.token, undefined);
  });

  it('Paso 3 · contraseña incorrecta → mismo mensaje genérico', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'OtraClave999' });
    assert.equal(res.status, 401);
    assert.equal(res.body.message, 'Correo o contraseña incorrectos');
  });

  it('Paso 4 · sesión guardada (cerrar y reabrir la app) → /me devuelve al usuario sin pedir credenciales', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.user.email, validUser.email);
  });

  it('Extra · sin token o con token inválido → 401', async () => {
    assert.equal((await request(app).get('/api/auth/me')).status, 401);
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer token-falso');
    assert.equal(res.status, 401);
  });

  it('Extra · campos vacíos → 422 "Este campo es obligatorio"', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    assert.equal(res.status, 422);
    assert.equal(res.body.errors.email, 'Este campo es obligatorio');
    assert.equal(res.body.errors.password, 'Este campo es obligatorio');
  });
});
