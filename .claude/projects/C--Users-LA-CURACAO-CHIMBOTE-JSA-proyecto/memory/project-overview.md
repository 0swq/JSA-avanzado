---
name: project-overview
description: Visión general del proyecto JSA - backend de biblioteca universitaria
metadata:
  type: project
---

## Proyecto JSA - API Biblioteca Universitaria

Repositorio: https://github.com/0swq/JSA-avanzado (rama master)

### Stack
- Backend: Node.js + Express + TypeScript + Prisma ORM + PostgreSQL
- Frontend: Angular (en `cliente/`)
- Auth: JWT + bcrypt
- Validación: Joi
- Arquitectura: Controller → Service → Repository → Prisma

### Estructura
- `servidor/` → backend (Express + TypeScript)
- `cliente/` → frontend Angular
- `servidor/src/modules/` → 16 módulos (auth, usuarios, roles, autores, categorias, editoriales, libros, recursos-digitales, ejemplares, prestamos, multas, pagos-multa, reservas, configuracion-multa, resenas, historial, favoritos)
- `servidor/prisma/` → schema.prisma, migrations, seed.ts
- `servidor/src/config/` → env.ts, database.ts, jwt.ts
- `servidor/src/middlewares/` → auth, role, validate, error
- `servidor/src/utils/` → ApiError.ts, response.ts

### Entry point
- `servidor/bin/www.ts` → arranque
- `servidor/app.ts` → configuración Express, 16 rutas montadas
- Scripts: `npm run dev` (nodemon + ts-node), `npm start` (producción)
- Path aliases: @utils, @config, @modules, @middlewares (tsconfig-paths)

### Base de datos
- PostgreSQL en `localhost:5432/biblioteca`
- Prisma 7 con `@prisma/adapter-pg`
- prisma.config.ts con dotenv para DATABASE_URL
- Seed: 4 roles + 4 usuarios + configuracion-multa
- Búsqueda full-text con tsvector en libro (español)
