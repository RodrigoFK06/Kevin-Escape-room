'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Users, DoorOpen, Clock, Award } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Ranking {
  id: number;
  equipo_id: number;
  equipo_nombre: string;
  sala_id: number;
  sala_nombre: string;
  puntaje: number;
  tiempo: number;
  cantidad_integrantes: number;
  registrado_en: string;
}

export default function RankingPage() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [filteredRankings, setFilteredRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSala, setFilterSala] = useState<string>('todas');

  useEffect(() => {
    fetchRankings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterSala, rankings]);

  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/ranking/obtener');
      const data = await response.json();
      
      // Validar que data sea un array
      if (Array.isArray(data)) {
        setRankings(data);
        setFilteredRankings(data);
      } else {
        console.error('La respuesta no es un array:', data);
        setRankings([]);
        setFilteredRankings([]);
      }
    } catch (error) {
      console.error('Error cargando ranking:', error);
      setRankings([]);
      setFilteredRankings([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (filterSala === 'todas') {
      setFilteredRankings(rankings);
    } else {
      setFilteredRankings(rankings.filter(r => r.sala_id === parseInt(filterSala)));
    }
  };

  const getMedalIcon = (position: number) => {
    if (position === 1) return <Trophy className="h-7 w-7 text-yellow-500 drop-shadow-lg" />;
    if (position === 2) return <Trophy className="h-6 w-6 text-gray-500 drop-shadow-lg" />;
    if (position === 3) return <Trophy className="h-6 w-6 text-orange-500 drop-shadow-lg" />;
    return <Award className="h-5 w-5 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando ranking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Tabla de Ranking</h1>
        <p className="text-gray-700 mt-2">
          Mejores puntajes de los equipos por sala
        </p>
      </div>

      {/* Filtros */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Filtrar por sala:
            </label>
            <Select value={filterSala} onValueChange={setFilterSala}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Seleccionar sala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las salas</SelectItem>
                <SelectItem value="1">El Paciente 136</SelectItem>
                <SelectItem value="2">El Último Conjuro</SelectItem>
                <SelectItem value="3">La Secuencia Perdida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Ranking */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Trophy className="h-5 w-5 text-brand-gold" />
            Rankings ({filteredRankings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-gray-900 font-semibold">Pos.</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Equipo</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Sala</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Puntaje</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Tiempo</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Integrantes</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRankings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-700">
                      No hay registros en el ranking
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRankings.map((ranking, index) => (
                    <TableRow 
                      key={ranking.id}
                      className={index < 3 ? 'bg-yellow-50/50' : ''}
                    >
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {getMedalIcon(index + 1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-600" />
                          <span className="font-semibold text-gray-900">{ranking.equipo_nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DoorOpen className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-900">{ranking.sala_nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-brand-gold text-brand-dark font-bold">
                          {ranking.puntaje} pts
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-gray-600" />
                          <span className="text-gray-900">{ranking.tiempo} min</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {ranking.cantidad_integrantes || 0} personas
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-900">
                        {format(new Date(ranking.registrado_en), 'dd/MM/yyyy', { locale: es })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      {filteredRankings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-3 border-b border-gray-200">
              <CardTitle className="text-sm font-bold text-gray-900 flex items-center justify-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" /> Mejor Puntaje
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-amber-600">
                {Math.max(...filteredRankings.map(r => r.puntaje))}
              </p>
              <p className="text-sm text-gray-700 mt-1">puntos</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-3 border-b border-gray-200">
              <CardTitle className="text-sm font-bold text-gray-900 flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" /> Mejor Tiempo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-blue-600">
                {Math.min(...filteredRankings.map(r => r.tiempo))}
              </p>
              <p className="text-sm text-gray-700 mt-1">minutos</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-3 border-b border-gray-200">
              <CardTitle className="text-sm font-bold text-gray-900 flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-green-600" /> Total Equipos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-green-600">
                {filteredRankings.length}
              </p>
              <p className="text-sm text-gray-700 mt-1">registrados</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
