# MoneyMind

App de finanzas personales: registro de gastos con categorización automática por IA ligera.
Equipo 4B · TecNM Celaya · Gestión de Proyectos de Software (Scrum).

## Stack (Plan de Desarrollo, sección 2.2)

- Frontend: React (Vite)
- Backend: Node.js + Express
- Base de datos: MySQL 8 / MariaDB 10
- Estándares: camelCase, Prettier + ESLint, Conventional Commits, Pull Request revisado antes de fusionar a `main`

## Requisitos

- Node.js 20 o superior
- MySQL 8 o MariaDB 10 corriendo en local

## Instalación

```bash
# 1. Dependencias de todo el proyecto
npm run install:all

# 2. Base de datos (crea la BD, las tablas y las categorías predefinidas)
mysql -u root -p < db/schema.sql
# (opcional) datos de ejemplo
mysql -u root -p < db/seed_demo.sql

# 3. Variables de entorno del backend
cp backend/.env.example backend/.env   # ajusta DB_USER / DB_PASSWORD
```

## Ejecución

```bash
npm run dev:backend    # API en http://localhost:4000
npm run dev:frontend   # App en http://localhost:5173
```

## Calidad

```bash
npm run lint           # ESLint
npm run format:check   # Prettier
npm test               # pruebas del backend (requieren MySQL; crean la BD moneymind_test)
```

## Estructura

```
backend/   API Express (src/) y pruebas (test/)
frontend/  App React
db/        schema.sql, seed_demo.sql y migraciones
docs/      evidencias de testing por historia (docs/evidencia/)
```
