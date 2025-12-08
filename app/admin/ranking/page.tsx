'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Users, DoorOpen, Clock, Award, Edit, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [filteredRankings, setFilteredRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSala, setFilterSala] = useState<string>('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentRanking, setCurrentRanking] = useState<Partial<Ranking>>({});
  const [sortField, setSortField] = useState<keyof Ranking>('puntaje');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchRankings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterSala, rankings, sortField, sortDirection]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
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
      toast({
        title: "Error",
        description: "No se pudo cargar el ranking",
        variant: "destructive"
      });
      setRankings([]);
      setFilteredRankings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ranking: Ranking) => {
    setCurrentRanking(ranking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRanking({});
  };

  const handleSaveRanking = async () => {
    try {
      setIsSaving(true);

      if (!currentRanking.puntaje || !currentRanking.tiempo || !currentRanking.cantidad_integrantes) {
        toast({
          title: "Error",
          description: "Todos los campos son requeridos",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`/api/ranking/actualizar/${currentRanking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          puntaje: currentRanking.puntaje,
          tiempo: currentRanking.tiempo,
          cantidad_integrantes: currentRanking.cantidad_integrantes
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Éxito",
          description: "Ranking actualizado correctamente"
        });
        handleCloseModal();
        fetchRankings();
      } else {
        throw new Error(data.error || 'Error al guardar');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el ranking",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRanking = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este registro del ranking?')) {
      return;
    }

    try {
      const response = await fetch(`/api/ranking/eliminar/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Éxito",
          description: "Registro eliminado correctamente"
        });
        fetchRankings();
      } else {
        throw new Error(data.mensaje || data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el registro",
        variant: "destructive"
      });
    }
  };

  const handleSort = (field: keyof Ranking) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const applyFilters = () => {
    let filtered = filterSala === 'todas'
      ? [...rankings]
      : rankings.filter(r => r.sala_id === parseInt(filterSala));

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortDirection === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    setFilteredRankings(filtered);
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
          <p className="text-gray-700">Cargando ranking...</p>
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
                  <TableHead className="text-gray-900 font-semibold cursor-pointer hover:bg-gray-50" onClick={() => handleSort('equipo_nombre')}>
                    <div className="flex items-center gap-1">
                      Equipo
                      {sortField === 'equipo_nombre' && (
                        <span className="text-brand-gold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold cursor-pointer hover:bg-gray-50" onClick={() => handleSort('sala_nombre')}>
                    <div className="flex items-center gap-1">
                      Sala
                      {sortField === 'sala_nombre' && (
                        <span className="text-brand-gold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold cursor-pointer hover:bg-gray-50" onClick={() => handleSort('puntaje')}>
                    <div className="flex items-center gap-1">
                      Puntaje
                      {sortField === 'puntaje' && (
                        <span className="text-brand-gold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold cursor-pointer hover:bg-gray-50" onClick={() => handleSort('tiempo')}>
                    <div className="flex items-center gap-1">
                      Tiempo
                      {sortField === 'tiempo' && (
                        <span className="text-brand-gold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold cursor-pointer hover:bg-gray-50" onClick={() => handleSort('cantidad_integrantes')}>
                    <div className="flex items-center gap-1">
                      Integrantes
                      {sortField === 'cantidad_integrantes' && (
                        <span className="text-brand-gold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold cursor-pointer hover:bg-gray-50" onClick={() => handleSort('registrado_en')}>
                    <div className="flex items-center gap-1">
                      Fecha
                      {sortField === 'registrado_en' && (
                        <span className="text-brand-gold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRankings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-700">
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
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenModal(ranking)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteRanking(ranking.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
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

      {/* Modal de Edición */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Ranking</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Equipo (Solo lectura)</Label>
              <Input
                value={currentRanking.equipo_nombre || ''}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label>Sala (Solo lectura)</Label>
              <Input
                value={currentRanking.sala_nombre || ''}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="puntaje">Puntaje *</Label>
              <Input
                id="puntaje"
                type="number"
                step="0.01"
                min="0"
                value={currentRanking.puntaje ?? ''}
                onChange={(e) => setCurrentRanking({...currentRanking, puntaje: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiempo">Tiempo (minutos) *</Label>
              <Input
                id="tiempo"
                type="number"
                min="1"
                value={currentRanking.tiempo ?? ''}
                onChange={(e) => setCurrentRanking({...currentRanking, tiempo: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidad_integrantes">Cantidad de Integrantes *</Label>
              <Input
                id="cantidad_integrantes"
                type="number"
                min="1"
                value={currentRanking.cantidad_integrantes ?? ''}
                onChange={(e) => setCurrentRanking({...currentRanking, cantidad_integrantes: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRanking} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>Guardar</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
