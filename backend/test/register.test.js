// HU01 — Testing: cada prueba corresponde a un paso de la tarjeta "Construir y probar el registro de cuenta"
import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestApp, cleanTables, validUser } from './helpers.js';

describe('HU01 · Registro de cuenta', () => {
  let app;
  let db;
  before(async () => ({ app, db } = await setupTestApp()));
  beforeEach(() => cleanTables(db));
  after(() => db.end());

  it('Paso 1 · datos válidos → se crea la cuenta y regresa sesión', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);
    assert.equal(res.status, 201);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, validUser.email);
    assert.equal(res.body.user.moneda, 'USD');
    assert.equal(res.body.user.password_hash, undefined);
  });

  it('Paso 2 · correo ya existente → 409 "Este correo ya está registrado"', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'ANA.TORRES@ejemplo.com' });
    assert.equal(res.status, 409);
    assert.equal(res.body.errors.email, 'Este correo ya está registrado');
  });

  it('Paso 3 · contraseña de 5 caracteres → 422 y no crea la cuenta', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: 'Ab123' });
    assert.equal(res.status, 422);
    assert.equal(res.body.errors.password, 'Mínimo 8 caracteres, con letras y números');
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM usuarios');
    assert.equal(rows[0].total, 0);
  });

  it('Paso 4 · sin moneda → se guarda con MXN', async () => {
    const sinMoneda = { ...validUser };
    delete sinMoneda.moneda;
    const res = await request(app).post('/api/auth/register').send(sinMoneda);
    assert.equal(res.status, 201);
    assert.equal(res.body.user.moneda, 'MXN');
    const [rows] = await db.query('SELECT moneda FROM usuarios WHERE email = ?', [validUser.email]);
    assert.equal(rows[0].moneda, 'MXN');
  });

  it('Paso 5 · tabla usuarios → el usuario existe y la contraseña no está en texto plano', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [validUser.email]);
    assert.equal(rows.length, 1);
    assert.notEqual(rows[0].password_hash, validUser.password);
    assert.match(rows[0].password_hash, /^\$2[aby]\$12\$/); // bcrypt, costo 12
  });

  it('Extra · varios campos inválidos → 422 con un mensaje por campo', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: '', email: 'correo-malo', password: '123' });
    assert.equal(res.status, 422);
    assert.deepEqual(Object.keys(res.body.errors).sort(), ['email', 'nombre', 'password']);
  });
});
