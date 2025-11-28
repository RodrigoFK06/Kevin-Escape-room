// Script para actualizar horarios en la base de datos
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno según el argumento
const env = process.argv[2] || 'local';
const envFile = env === 'production' ? '.env.production' : '.env';
dotenv.config({ path: join(__dirname, '..', envFile) });

console.log(`🔧 Usando entorno: ${env === 'production' ? 'PRODUCCIÓN' : 'LOCAL'}`);
console.log(`📁 Archivo: ${envFile}\n`);

const prisma = new PrismaClient();

async function actualizarHorarios() {
  try {
    console.log('🗑️  Eliminando horarios existentes...');
    const deleted = await prisma.horario.deleteMany({});
    console.log(`   ✅ ${deleted.count} horarios eliminados`);

    console.log('\n📅 Insertando nuevos horarios...');
    
    const nuevosHorarios = [
      '11:00:00',
      '12:30:00',
      '14:00:00',
      '15:30:00',
      '17:00:00',
      '18:30:00',
      '20:00:00',
      '21:30:00'
    ];

    const salas = [1, 2, 3]; // El Paciente 136, El Último Conjuro, La Secuencia Perdida
    
    let insertados = 0;
    for (const salaId of salas) {
      for (const hora of nuevosHorarios) {
        // Convertir "HH:MM:SS" a Date object con fecha arbitraria
        const [hours, minutes, seconds] = hora.split(':').map(Number);
        const horaDate = new Date(2000, 0, 1, hours, minutes, seconds);
        
        await prisma.horario.create({
          data: {
            sala_id: salaId,
            hora: horaDate
          }
        });
        insertados++;
      }
      console.log(`   ✅ Sala ${salaId}: 8 horarios insertados`);
    }

    console.log(`\n🎉 ¡Completado! Total: ${insertados} horarios insertados`);
    console.log('\nNuevos horarios disponibles:');
    nuevosHorarios.forEach(h => console.log(`   - ${h.slice(0, 5)}`));

  } catch (error) {
    console.error('❌ Error al actualizar horarios:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

actualizarHorarios()
  .then(() => {
    console.log('\n✨ Script ejecutado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
