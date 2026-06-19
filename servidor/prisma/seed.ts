import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Creando roles...');

  const adminRol = await prisma.rol.upsert({
    where: { nombre: 'admin' },
    update: {},
    create: { nombre: 'admin', descripcion: 'Administrador del sistema' },
  });

  const biblioRol = await prisma.rol.upsert({
    where: { nombre: 'bibliotecario' },
    update: {},
    create: { nombre: 'bibliotecario', descripcion: 'Bibliotecario' },
  });

  await prisma.rol.upsert({
    where: { nombre: 'docente' },
    update: {},
    create: { nombre: 'docente', descripcion: 'Docente' },
  });

  await prisma.rol.upsert({
    where: { nombre: 'estudiante' },
    update: {},
    create: { nombre: 'estudiante', descripcion: 'Estudiante' },
  });

  console.log('Roles creados: admin, bibliotecario, docente, estudiante');

  const hash = await bcrypt.hash('12345678', 10);

  await prisma.usuario.upsert({
    where: { correo: 'admin@biblioteca.edu' },
    update: {},
    create: {
      nombre: 'Admin',
      apellidos: 'Sistema',
      correo: 'admin@biblioteca.edu',
      passwordHash: hash,
      rolId: adminRol.id,
    },
  });

  console.log('Admin: admin@biblioteca.edu / 12345678');
  console.log('Seed completado.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
