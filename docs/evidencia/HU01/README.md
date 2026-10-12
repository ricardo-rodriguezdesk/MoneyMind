# Evidencia de Testing — HU01 · Registro de cuenta

Tarjeta: **Construir y probar el registro de cuenta de usuario** · Sprint 1
Fecha de ejecución: 12 oct 2026 · Pruebas automáticas: `backend/test/register.test.js` (salida en `salida-pruebas.txt`)

| # | Paso | Resultado esperado | Resultado obtenido | Evidencia |
|---|------|--------------------|--------------------|-----------|
| 1 | Registrar con datos válidos | Se crea la cuenta y entra al dashboard | ✅ Pasó. Cuenta creada y redirección a `/dashboard` | `04-registro-exitoso-dashboard.png`, prueba "Paso 1" |
| 2 | Registrar con un correo ya existente | Campo en rojo con "Este correo ya está registrado" | ✅ Pasó | `05-correo-duplicado.png`, prueba "Paso 2" |
| 3 | Contraseña de 5 caracteres | Campo en rojo y no deja enviar | ✅ Pasó. Sigue en el formulario y no se crea el usuario | `02-contrasena-corta-rojo.png`, prueba "Paso 3" |
| 4 | Dejar la moneda sin seleccionar | Se guarda con MXN | ✅ Pasó. Se guardó `MXN` | `03-campos-validos-verde.png`, prueba "Paso 4" |
| 5 | Revisar la tabla `usuarios` en la BD | El usuario existe y la contraseña no está en texto plano | ✅ Pasó. `password_hash` es bcrypt (`$2a$12$…`) | prueba "Paso 5" y consulta de abajo |

Consulta a la BD (paso 5):

```
id_usuario  nombre       email                   moneda  hash
1           Ana Torres   ana.torres@ejemplo.com  MXN     $2a$12$nbNyW…
```

## Criterios de aceptación de la historia

- Al abrir "Crear cuenta" pide nombre, correo, contraseña y moneda → ✅ (`01-formulario-vacio.png`)
- Dato válido en verde / inválido en rojo con mensaje → ✅ (`02`, `03`)
- Sin moneda se asigna MXN → ✅
- Todo en verde y "Crear cuenta" → crea la cuenta y redirige al dashboard → ✅ (`04`)
- Algún campo en rojo y "Crear cuenta" → no crea la cuenta y regresa al formulario → ✅ (`02`)

El resultado final coincide con los criterios de aceptación de HU01 en el Backlog Product.
