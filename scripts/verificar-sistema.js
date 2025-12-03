const BASE_URL = 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testEndpoint(name, url, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, options);
    const data = await response.json();
    
    if (response.ok) {
      log(`✅ ${name}`, colors.green);
      return { success: true, data };
    } else {
      log(`❌ ${name} - Status: ${response.status}`, colors.red);
      return { success: false, error: data };
    }
  } catch (error) {
    log(`❌ ${name} - Error: ${error.message}`, colors.red);
    return { success: false, error: error.message };
  }
}

async function verificarSistema() {
  log('\n=== VERIFICACIÓN COMPLETA DEL SISTEMA ===\n', colors.bold + colors.cyan);

  // 1. VERIFICAR APIs DE SALAS
  log('\n📍 MÓDULO DE SALAS', colors.yellow);
  await testEndpoint('GET /api/salas/obtener', '/api/salas/obtener');

  // 2. VERIFICAR APIs DE EQUIPOS
  log('\n👥 MÓDULO DE EQUIPOS', colors.yellow);
  await testEndpoint('GET /api/equipos/obtener', '/api/equipos/obtener');

  // 3. VERIFICAR APIs DE HORARIOS
  log('\n🕐 MÓDULO DE HORARIOS', colors.yellow);
  await testEndpoint('GET /api/horarios/obtener', '/api/horarios/obtener');

  // 4. VERIFICAR APIs DE RANKING
  log('\n🏆 MÓDULO DE RANKING', colors.yellow);
  await testEndpoint('GET /api/ranking/obtener', '/api/ranking/obtener');

  // 5. VERIFICAR APIs DE RESERVAS
  log('\n📅 MÓDULO DE RESERVAS', colors.yellow);
  await testEndpoint('GET /api/reservas/obtener', '/api/reservas/obtener');

  // 6. VERIFICAR HORARIOS DISPONIBLES
  log('\n⏰ HORARIOS DISPONIBLES', colors.yellow);
  const fecha = new Date().toISOString().split('T')[0];
  await testEndpoint(
    'GET /api/horarios/disponibles', 
    `/api/horarios/disponibles?sala_id=1&fecha=${fecha}`
  );

  // 7. VERIFICAR FECHAS OCUPADAS
  log('\n📆 FECHAS OCUPADAS', colors.yellow);
  await testEndpoint(
    'GET /api/horarios/fechas-ocupadas',
    '/api/horarios/fechas-ocupadas?sala_id=1'
  );

  log('\n=== VERIFICACIÓN COMPLETADA ===\n', colors.bold + colors.cyan);
  log('Nota: Para pruebas de CREATE, UPDATE y DELETE, usa el panel admin\n', colors.yellow);
}

// Ejecutar verificación
verificarSistema().catch(console.error);
