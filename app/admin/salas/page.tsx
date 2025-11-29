'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DoorOpen, Users, Clock, Star, Tag } from 'lucide-react';

interface Sala {
  id: number;
  nombre: string;
  descripcion: string;
  min_jugadores: number;
  max_jugadores: number;
  duracion: number;
  dificultad: string;
  rating: number;
  tags: string;
  imagen: string;
  destacado: boolean;
  reservas_hoy: number;
}

export default function SalasPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Por ahora mostramos datos mock ya que no hay endpoint /api/salas/obtener
    // En producción deberías crear ese endpoint
    const mockSalas: Sala[] = [
      {
        id: 1,
        nombre: 'El Paciente 136',
        descripcion: 'Internado en un pabellón psiquiátrico abandonado, el Paciente 136 volvió a despertar. Entre respiraciones, voces y pulsos de luz, descubrirás que nada fue un accidente.',
        min_jugadores: 2,
        max_jugadores: 6,
        duracion: 60,
        dificultad: 'Media',
        rating: 5.0,
        tags: 'Terror Psicológico, Laboratorio, Alta tensión',
        imagen: '/rooms/paciente136.jpg',
        destacado: true,
        reservas_hoy: 0
      },
      {
        id: 2,
        nombre: 'El Último Conjuro',
        descripcion: 'En una mansión olvidada por el tiempo, la familia Valdemar desapareció tras realizar un ritual que nadie comprendió. Descubre qué ocurrió aquella noche.',
        min_jugadores: 2,
        max_jugadores: 6,
        duracion: 60,
        dificultad: 'Media',
        rating: 5.0,
        tags: 'Misterio, Ritual, Mansión',
        imagen: '/rooms/conjuro.jpg',
        destacado: false,
        reservas_hoy: 0
      },
      {
        id: 3,
        nombre: 'La Secuencia Perdida',
        descripcion: 'El laboratorio del Dr. Silvan quedó sellado tras un fallo en su último experimento. Tu misión es desactivar el protocolo y descubrir qué intentaba ocultar Silvan.',
        min_jugadores: 2,
        max_jugadores: 6,
        duracion: 60,
        dificultad: 'Alta',
        rating: 5.0,
        tags: 'Ciencia Ficción, Tecnología, Puzzle',
        imagen: '/rooms/secuencia.jpg',
        destacado: false,
        reservas_hoy: 0
      }
    ];

    setSalas(mockSalas);
    setLoading(false);
  }, []);

  const getDificultadColor = (dificultad: string) => {
    const colors: Record<string, string> = {
      'Baja': 'bg-green-100 text-green-900 border border-green-300',
      'Media': 'bg-yellow-100 text-yellow-900 border border-yellow-300',
      'Alta': 'bg-red-100 text-red-900 border border-red-300',
      'Extrema': 'bg-purple-100 text-purple-900 border border-purple-300'
    };
    return colors[dificultad] || 'bg-gray-100 text-gray-900 border border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando salas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Salas</h1>
        <p className="text-gray-700 mt-2">
          Administra la información de las salas de escape
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {salas.map((sala) => (
          <Card key={sala.id} className="bg-white overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-5 w-5 text-brand-gold" />
                  <CardTitle className="text-lg text-gray-900">{sala.nombre}</CardTitle>
                </div>
                {sala.destacado && (
                  <Badge className="bg-brand-gold text-brand-dark">Destacada</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {/* Descripción */}
              <p className="text-sm text-gray-800 line-clamp-2">
                {sala.descripcion}
              </p>

              {/* Información básica */}
              <div className="space-y-3">
                {/* Jugadores */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span>Jugadores</span>
                  </div>
                  <Badge variant="outline" className="text-gray-900">
                    {sala.min_jugadores} - {sala.max_jugadores}
                  </Badge>
                </div>

                {/* Duración */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span>Duración</span>
                  </div>
                  <Badge variant="outline" className="text-gray-900">{sala.duracion} min</Badge>
                </div>

                {/* Dificultad */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <Tag className="h-4 w-4 text-gray-600" />
                    <span>Dificultad</span>
                  </div>
                  <Badge className={getDificultadColor(sala.dificultad)}>
                    {sala.dificultad}
                  </Badge>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <Star className="h-4 w-4 text-gray-600" />
                    <span>Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{sala.rating}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {sala.tags && (
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-700 mb-2">Características:</p>
                  <div className="flex flex-wrap gap-1">
                    {sala.tags.split(',').map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs text-gray-900">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Estadísticas */}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-800">Reservas hoy:</span>
                  <Badge className="bg-brand-gold text-brand-dark font-semibold">
                    {sala.reservas_hoy}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {salas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-700">
            No hay salas configuradas
          </CardContent>
        </Card>
      )}
    </div>
  );
}
