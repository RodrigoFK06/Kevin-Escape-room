'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Trophy,
  DoorOpen,
  LogOut,
  Menu,
  X,
  Clock,
  Key
} from 'lucide-react';

interface AdminUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Verificar sesión
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/session');
        if (response.ok) {
          const data = await response.json();
          setUser(data.usuario);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        router.push('/admin/login');
      }
    };

    if (pathname !== '/admin/login') {
      checkSession();
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch('/api/admin/session', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  // No mostrar layout en página de login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Calendar, label: 'Reservas', href: '/admin/reservas' },
    { icon: Clock, label: 'Horarios', href: '/admin/horarios' },
    { icon: DoorOpen, label: 'Salas', href: '/admin/salas' },
    { icon: Users, label: 'Equipos', href: '/admin/equipos' },
    { icon: Trophy, label: 'Ranking', href: '/admin/ranking' },
    { icon: Key, label: 'Generador', href: '/admin/generador' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <h1 className="text-2xl font-bold text-gray-900">
              Encrypted Admin
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md border-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Usuario y Logout */}
          <div className="p-4 border-t-2 border-gray-200 bg-gray-50">
            {user && (
              <div className="mb-3 p-3 bg-white border-2 border-blue-200 rounded-lg">
                <p className="text-sm font-bold text-gray-900">{user.nombre}</p>
                <p className="text-xs text-gray-600 font-medium">{user.email}</p>
                <p className="text-xs text-blue-600 uppercase mt-1 font-semibold">
                  {user.rol}
                </p>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-2 bg-red-600 hover:bg-red-700 text-white border-2 border-red-700 font-semibold shadow-md"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-40 border-b-2 border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="flex items-center gap-4 ml-auto">
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm" className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold">
                  Ver Sitio Web
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>

      {/* Overlay para cerrar sidebar en mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
