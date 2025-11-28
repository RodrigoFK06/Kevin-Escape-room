// API Route para actualizar horarios en producción
// Solo accesible con clave secreta

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Verificar clave de seguridad
    const { secretKey } = await request.json();
    
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

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

    const salas = [1, 2, 3];
    
    const horariosCreados = [];
    for (const salaId of salas) {
      for (const hora of nuevosHorarios) {
        const horario = await prisma.horario.create({
          data: {
            sala_id: salaId,
            hora: hora
          }
        });
        horariosCreados.push(horario);
      }
    }

    return NextResponse.json({
      success: true,
      mensaje: '¡Horarios actualizados exitosamente!',
      eliminados: deleted.count,
      creados: horariosCreados.length,
      nuevosHorarios: nuevosHorarios
    });

  } catch (error: any) {
    console.error('❌ Error al actualizar horarios:', error);
    return NextResponse.json(
      { 
        error: 'Error al actualizar horarios', 
        detalle: error.message 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
