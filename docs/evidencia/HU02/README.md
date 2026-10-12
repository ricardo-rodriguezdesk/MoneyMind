# Evidencia de Testing — HU02 · Inicio de sesión

Tarjeta: **Construir y probar el inicio de sesión** · Sprint 1
Fecha de ejecución: 12 oct 2026 · Pruebas automáticas: `backend/test/login.test.js` (salida en `salida-pruebas.txt`)

| # | Paso | Resultado esperado | Resultado obtenido | Evidencia |
|---|------|--------------------|--------------------|-----------|
| 1 | Iniciar sesión con credenciales correctas | Entra al dashboard en menos de 2 segundos | ✅ Pasó. Dashboard cargado en 416 ms | `04-login-correcto-dashboard.png`, `04b-tiempo-de-respuesta.png`, prueba "Paso 1" |
| 2 | Probar con un correo no registrado | Muestra "Correo o contraseña incorrectos" | ✅ Pasó | `02-correo-no-registrado.png`, prueba "Paso 2" |
| 3 | Probar con una contraseña incorrecta | Muestra el mismo mensaje genérico | ✅ Pasó. Mensaje idéntico al del paso 2 | `03-contrasena-incorrecta.png`, prueba "Paso 3" |
| 4 | Cerrar y reabrir la app sin cerrar sesión | Entra directo al dashboard | ✅ Pasó. Al abrir `/` redirige a `/dashboard` sin pedir credenciales | `05-reabrir-app-entra-directo.png`, prueba "Paso 4" |

Verificación adicional: al presionar "Cerrar sesión" la app regresa al login y `/dashboard` ya no abre sin credenciales.

## Criterios de aceptación de la historia

- Al abrir el login pide correo y contraseña → ✅ (`01-login.png`)
- Credenciales correctas → dashboard en menos de 2 segundos → ✅
- Correo no registrado o contraseña incorrecta → "Correo o contraseña incorrectos" → ✅
- Sesión iniciada y no cerrada → entra directo al dashboard → ✅

El resultado final coincide con los criterios de aceptación de HU02 en el Backlog Product.
