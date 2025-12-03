import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Determinar qué archivo .env usar
const env = process.argv[2] === 'production' ? 'production' : 'local';
const envFile = env === 'production' ? '.env.production' : '.env';

console.log(`🔧 Actualizando nombres de salas en: ${env.toUpperCase()}`);
console.log(`📁 Archivo: ${envFile}\n`);

dotenv.config({ path: envFile });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function actualizarNombresSalas() {
  try {
    console.log('✅ Conectado a la base de datos\n');

    // Actualizar los nombres de las salas
    const salas = [
      { id: 1, nombre: 'El Paciente 136', descripcion: 'Un hospital psiquiátrico abandonado guarda oscuros secretos...' },
      { id: 2, nombre: 'El Último Conjuro', descripcion: 'Una antigua biblioteca de magia oscura te espera...' },
      { id: 3, nombre: 'La Secuencia Perdida', descripcion: 'Un laboratorio científico con experimentos peligrosos...' }
    ];

    console.log('🔄 Actualizando nombres de salas...\n');

    for (const sala of salas) {
      const actualizada = await prisma.sala.update({
        where: { id: sala.id },
        data: {
          nombre: sala.nombre,
          descripcion: sala.descripcion
        }
      });
      console.log(`   ✅ Sala ${sala.id}: ${actualizada.nombre}`);
    }

    console.log(`\n🎉 ¡Nombres actualizados exitosamente!`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

actualizarNombresSalas();
