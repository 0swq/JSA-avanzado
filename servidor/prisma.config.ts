import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  engine: 'classic',
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    path: 'prisma/migrations',
  },
  seed: {
    ts: 'ts-node -r tsconfig-paths/register prisma/seed.ts',
  },
});
