import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Determinar qué archivo .env usar
const env = process.argv[2] === 'production' ? 'production' : 'local';
const envFile = env === 'production' ? '.env.production' : '.env';

console.log(`🔧 Verificando horarios en: ${env.toUpperCase()}`);
console.log(`📁 Archivo: ${envFile}\n`);

dotenv.config({ path: envFile });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function verificarHorarios() {
  try {
    console.log('✅ Conectado a la base de datos\n');

    // Obtener todos los horarios con información de sala
    const horarios = await prisma.horario.findMany({
      include: {
        sala: {
          select: {
            nombre: true
          }
        }
      },
      orderBy: [
        { sala_id: 'asc' },
        { hora: 'asc' }
      ]
    });

    console.log('📋 Horarios registrados en la base de datos:\n');

    let currentSala = null;
    for (const horario of horarios) {
      if (horario.sala_id !== currentSala) {
        console.log(`\n🏠 Sala ${horario.sala_id}: ${horario.sala.nombre}`);
        currentSala = horario.sala_id;
      }
      // Formatear hora como HH:MM
      const hora = horario.hora.toISOString().substring(11, 16);
      console.log(`   - ID ${horario.id}: ${hora}`);
    }

    console.log(`\n✅ Total de horarios: ${horarios.length}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verificarHorarios();
