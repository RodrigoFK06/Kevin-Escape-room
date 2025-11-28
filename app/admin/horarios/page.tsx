'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DoorOpen } from 'lucide-react';

interface Horario {
  id: number;
  sala_id: number;
  hora: string;
  sala_nombre: string;
}

interface HorariosPorSala {
  [salaId: number]: {
    nombre: string;
    horarios: Horario[];
  };
}

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<HorariosPorSala>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    try {
      const response = await fetch('/api/horarios/obtener');
      const data = await response.json();

      // Agrupar por sala
      const grouped: HorariosPorSala = {};
      data.data.forEach((h: Horario) => {
        if (!grouped[h.sala_id]) {
          grouped[h.sala_id] = {
            nombre: h.sala_nombre,
            horarios: []
          };
        }
        grouped[h.sala_id].horarios.push(h);
      });

      setHorarios(grouped);
    } catch (error) {
      console.error('Error cargando horarios:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando horarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Horarios</h1>
        <p className="text-gray-700 mt-2">
          Consulta los horarios disponibles por sala
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(horarios).map(([salaId, data]) => (
          <Card key={salaId} className="bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <DoorOpen className="h-5 w-5 text-brand-gold" />
                {data.nombre}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {data.horarios.map((horario: Horario) => (
                  <div
                    key={horario.id}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-brand-gold" />
                      <span className="font-bold text-gray-900 text-lg">
                        {horario.hora.slice(0, 5)}
                      </span>
                    </div>
                    <Badge className="bg-green-50 text-green-700 border border-green-300 font-semibold">Activo</Badge>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-800 font-medium">
                  Total: <span className="font-bold text-gray-900">{data.horarios.length}</span> horarios
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(horarios).length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-700">
            No hay horarios configurados
          </CardContent>
        </Card>
      )}
    </div>
  );
}
