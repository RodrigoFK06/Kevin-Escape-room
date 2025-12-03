'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DoorOpen, Users, Clock, Star, Tag, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentSala, setCurrentSala] = useState<Partial<Sala>>({});

  useEffect(() => {
    fetchSalas();
  }, []);

  const fetchSalas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/salas/obtener');
      const data = await response.json();
      
      if (data.success) {
        // Obtener reservas de hoy
        const hoy = new Date().toISOString().split('T')[0];
        const resResponse = await fetch(`/api/reservas/obtener?fecha=${hoy}`);
        const resData = await resResponse.json();
        
        const reservasPorSala: Record<number, number> = {};
        if (resData.data && Array.isArray(resData.data)) {
          resData.data.forEach((reserva: any) => {
            reservasPorSala[reserva.sala_id] = (reservasPorSala[reserva.sala_id] || 0) + 1;
          });
        }

        const salasConReservas = data.data.map((sala: Sala) => ({
          ...sala,
          reservas_hoy: reservasPorSala[sala.id] || 0
        }));

        setSalas(salasConReservas);
      }
    } catch (error) {
      console.error('Error cargando salas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las salas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (sala?: Sala) => {
    if (sala) {
      setIsEditing(true);
      setCurrentSala(sala);
    } else {
      setIsEditing(false);
      setCurrentSala({
        nombre: '',
        descripcion: '',
        min_jugadores: 2,
        max_jugadores: 6,
        duracion: 60,
        dificultad: 'Media',
        rating: 5.0,
        tags: '',
        imagen: '',
        destacado: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSala({});
  };

  const handleSaveSala = async () => {
    try {
      setIsSaving(true);

      if (!currentSala.nombre || !currentSala.descripcion) {
        toast({
          title: "Error",
          description: "Nombre y descripción son requeridos",
          variant: "destructive"
        });
        return;
      }

      const url = isEditing 
        ? `/api/salas/actualizar/${currentSala.id}`
        : '/api/salas/crear';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sala: currentSala })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Éxito",
          description: isEditing ? "Sala actualizada correctamente" : "Sala creada correctamente"
        });
        handleCloseModal();
        fetchSalas();
      } else {
        throw new Error(data.error || 'Error al guardar');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la sala",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSala = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta sala? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`/api/salas/eliminar/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Éxito",
          description: "Sala eliminada correctamente"
        });
        fetchSalas();
      } else {
        throw new Error(data.mensaje || data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la sala",
        variant: "destructive"
      });
    }
  };

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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
          <p className="text-gray-700">Cargando salas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Salas</h1>
            <p className="text-gray-700 mt-2">
              Administra la información de las salas de escape
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Sala
          </Button>
        </div>
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
                      <Badge key={idx} className="text-xs bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Estadísticas */}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-gray-800">Reservas hoy:</span>
                  <Badge className="bg-brand-gold text-brand-dark font-semibold">
                    {sala.reservas_hoy}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleOpenModal(sala)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteSala(sala.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {salas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-700">
            No hay salas configuradas. Crea una nueva sala para comenzar.
          </CardContent>
        </Card>
      )}

      {/* Modal de Edición/Creación */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Sala' : 'Nueva Sala'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={currentSala.nombre || ''}
                onChange={(e) => setCurrentSala({...currentSala, nombre: e.target.value})}
                placeholder="Ej: El Paciente 136"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={currentSala.descripcion || ''}
                onChange={(e) => setCurrentSala({...currentSala, descripcion: e.target.value})}
                placeholder="Describe la sala..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_jugadores">Mín. Jugadores</Label>
                <Input
                  id="min_jugadores"
                  type="number"
                  min="1"
                  value={currentSala.min_jugadores || 2}
                  onChange={(e) => setCurrentSala({...currentSala, min_jugadores: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_jugadores">Máx. Jugadores</Label>
                <Input
                  id="max_jugadores"
                  type="number"
                  min="1"
                  value={currentSala.max_jugadores || 6}
                  onChange={(e) => setCurrentSala({...currentSala, max_jugadores: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duracion">Duración (min)</Label>
                <Input
                  id="duracion"
                  type="number"
                  min="30"
                  step="15"
                  value={currentSala.duracion || 60}
                  onChange={(e) => setCurrentSala({...currentSala, duracion: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dificultad">Dificultad</Label>
                <Select 
                  value={currentSala.dificultad || 'Media'} 
                  onValueChange={(value) => setCurrentSala({...currentSala, dificultad: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Extrema">Extrema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={currentSala.rating || 5.0}
                  onChange={(e) => setCurrentSala({...currentSala, rating: parseFloat(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destacado">Destacada</Label>
                <Select 
                  value={currentSala.destacado ? 'true' : 'false'} 
                  onValueChange={(value) => setCurrentSala({...currentSala, destacado: value === 'true'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separados por coma)</Label>
              <Input
                id="tags"
                value={currentSala.tags || ''}
                onChange={(e) => setCurrentSala({...currentSala, tags: e.target.value})}
                placeholder="Terror, Suspenso, Misterio"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagen">URL de Imagen</Label>
              <Input
                id="imagen"
                value={currentSala.imagen || ''}
                onChange={(e) => setCurrentSala({...currentSala, imagen: e.target.value})}
                placeholder="/rooms/sala.jpg"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSala} disabled={isSaving}>
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
