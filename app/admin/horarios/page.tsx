'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Clock, DoorOpen, Plus, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [horarios, setHorarios] = useState<HorariosPorSala>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSalaId, setSelectedSalaId] = useState<number | null>(null);
  const [newHora, setNewHora] = useState('');

  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    try {
      setLoading(true);
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
      toast({
        title: "Error",
        description: "No se pudieron cargar los horarios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (salaId: number) => {
    setSelectedSalaId(salaId);
    setNewHora('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSalaId(null);
    setNewHora('');
  };

  const handleAddHorario = async () => {
    try {
      setIsSaving(true);

      if (!newHora) {
        toast({
          title: "Error",
          description: "Debe ingresar una hora",
          variant: "destructive"
        });
        return;
      }

      // Validar formato HH:MM
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(newHora)) {
        toast({
          title: "Error",
          description: "Formato de hora inválido. Use HH:MM (ejemplo: 14:30)",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch('/api/horarios/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sala_id: selectedSalaId,
          hora: newHora 
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Éxito",
          description: "Horario agregado correctamente"
        });
        handleCloseModal();
        fetchHorarios();
      } else {
        throw new Error(data.error || 'Error al agregar');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo agregar el horario",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHorario = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este horario?')) {
      return;
    }

    try {
      const response = await fetch(`/api/horarios/eliminar/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Éxito",
          description: "Horario eliminado correctamente"
        });
        fetchHorarios();
      } else {
        throw new Error(data.mensaje || data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el horario",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
          <p className="text-gray-700">Cargando horarios...</p>
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
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <DoorOpen className="h-5 w-5 text-brand-gold" />
                  {data.nombre}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleOpenModal(parseInt(salaId))}
                  className="text-brand-gold border-brand-gold hover:bg-brand-gold/10"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Agregar
                </Button>
              </div>
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
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-50 text-green-700 border border-green-300 font-semibold">Activo</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                        onClick={() => handleDeleteHorario(horario.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
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

      {/* Modal para Agregar Horario */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Horario</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hora">Hora (formato HH:MM) *</Label>
              <Input
                id="hora"
                type="time"
                value={newHora}
                onChange={(e) => setNewHora(e.target.value)}
                placeholder="14:30"
              />
              <p className="text-xs text-gray-600">
                Ejemplo: 14:30, 18:00, 21:30
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleAddHorario} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Agregando...
                </>
              ) : (
                <>Agregar</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
