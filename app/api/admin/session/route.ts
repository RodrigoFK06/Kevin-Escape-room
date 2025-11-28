// API endpoint para logout y verificar sesión
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET - Verificar sesión actual
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const userData = JSON.parse(session.value);

    return NextResponse.json({
      authenticated: true,
      usuario: userData
    });

  } catch (error) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}

// POST - Logout
export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    mensaje: 'Logout exitoso'
  });

  // Eliminar cookie de sesión
  response.cookies.delete('admin_session');

  return response;
}
