import mysql from 'mysql2/promise';
import { config } from './config.js';

/** Crea el pool de conexiones a MySQL/MariaDB. */
export function createPool(overrides = {}) {
  return mysql.createPool({
    ...config.db,
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true, // las fechas se devuelven como texto 'YYYY-MM-DD'
    ...overrides,
  });
}
