'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Trophy, DoorOpen } from 'lucide-react';

interface Stats {
  reservasHoy: number;
  reservasPendientes: number;
  totalEquipos: number;
  totalRankings: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    reservasHoy: 0,
    reservasPendientes: 0,
    totalEquipos: 0,
    totalRankings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtener estadísticas de diferentes endpoints
        const [reservasRes, equiposRes, rankingRes] = await Promise.all([
          fetch('/api/reservas/obtener'),
          fetch('/api/equipos/obtener'),
          fetch('/api/ranking/obtener'),
        ]);

        const reservasResult = await reservasRes.json();
        const equiposResult = await equiposRes.json();
        const rankingsResult = await rankingRes.json();

        // Extraer arrays correctamente
        const reservas = Array.isArray(reservasResult) ? reservasResult : (reservasResult.data || []);
        const equipos = Array.isArray(equiposResult) ? equiposResult : [];
        const rankings = Array.isArray(rankingsResult) ? rankingsResult : [];

        const hoy = new Date().toISOString().split('T')[0];
        const reservasHoy = reservas.filter((r: any) => r.fecha === hoy).length;
        const pendientes = reservas.filter((r: any) => r.estado === 'pendiente').length;

        setStats({
          reservasHoy,
          reservasPendientes: pendientes,
          totalEquipos: equipos.length,
          totalRankings: rankings.length,
        });
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Reservas Hoy',
      value: stats.reservasHoy,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Reservas Pendientes',
      value: stats.reservasPendientes,
      icon: Calendar,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Equipos Registrados',
      value: stats.totalEquipos,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Rankings Totales',
      value: stats.totalRankings,
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-700">
          Bienvenido al panel de administración de Encrypted Escape Room
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card className="bg-white hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Calendar className="h-5 w-5 text-brand-gold" />
              Gestionar Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Ver, editar y confirmar reservas de clientes
            </p>
            <a href="/admin/reservas" className="text-brand-gold hover:underline text-sm font-medium mt-2 inline-block">
              Ir a Reservas →
            </a>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Users className="h-5 w-5 text-brand-gold" />
              Ver Equipos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Consultar equipos registrados y sus integrantes
            </p>
            <a href="/admin/equipos" className="text-brand-gold hover:underline text-sm font-medium mt-2 inline-block">
              Ir a Equipos →
            </a>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Trophy className="h-5 w-5 text-brand-gold" />
              Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Ver y gestionar tabla de clasificación
            </p>
            <a href="/admin/ranking" className="text-brand-gold hover:underline text-sm font-medium mt-2 inline-block">
              Ir a Ranking →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
