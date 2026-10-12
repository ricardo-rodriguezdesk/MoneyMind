USE moneymind;

-- ============================================================
--  Usuario y gastos de ejemplo (para pruebas del equipo)
-- ============================================================
INSERT INTO usuarios (nombre, email, password_hash, moneda) VALUES
  ('Ana Torres', 'ana.torres@ejemplo.com', '$2b$12$ejemplo_hash_no_usar_en_produccion', 'MXN');

INSERT INTO gastos (id_usuario, id_categoria, monto, descripcion, fecha_gasto,
                     categoria_sugerida_ia, confianza_ia, fue_corregido)
VALUES
  (1, 1, 145.00, 'tacos con amigos',      CURDATE(), 1, 0.930, FALSE),
  (1, 2, 89.50,  'uber al trabajo',       CURDATE(), 2, 0.870, FALSE),
  (1, 3, 220.00, 'cine y palomitas',      CURDATE(), 4, 0.610, TRUE);

INSERT INTO presupuestos (id_usuario, id_categoria, monto_limite, periodo, fecha_inicio)
VALUES
  (1, 1, 2000.00, 'mensual', DATE_FORMAT(CURDATE(), '%Y-%m-01')),
  (1, 3, 800.00,  'mensual', DATE_FORMAT(CURDATE(), '%Y-%m-01'));
