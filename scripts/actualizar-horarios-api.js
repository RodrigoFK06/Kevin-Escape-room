// Script para actualizar horarios llamando al API endpoint
// Uso: node scripts/actualizar-horarios-api.js [URL]

const url = process.argv[2] || 'http://localhost:3000';
const secretKey = 'encrypted-escape-room-2025-admin';

async function actualizarHorarios() {
  try {
    console.log(`🔧 Conectando a: ${url}/api/admin/actualizar-horarios\n`);
    
    const response = await fetch(`${url}/api/admin/actualizar-horarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ secretKey })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error desconocido');
    }

    console.log('✅ ¡Éxito!');
    console.log(`   📊 Horarios eliminados: ${data.eliminados}`);
    console.log(`   📅 Horarios creados: ${data.creados}\n`);
    console.log('🕐 Nuevos horarios disponibles:');
    data.nuevosHorarios.forEach(h => console.log(`   - ${h.slice(0, 5)}`));
    console.log('\n✨ Actualización completada exitosamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

actualizarHorarios();
