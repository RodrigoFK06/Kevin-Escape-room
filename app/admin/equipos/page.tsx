'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, User, Calendar, Edit, Trash2, Loader2, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface Integrante {
  id: number;
  nombre: string;
}

interface Equipo {
  id: number;
  nombre: string;
  codigo: string;
  creado_en: string;
  integrantes: Integrante[];
}

export default function EquiposPage() {
  const { toast } = useToast();
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [filteredEquipos, setFilteredEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentEquipo, setCurrentEquipo] = useState<Partial<Equipo>>({});
  const [integrantesList, setIntegrantesList] = useState<string[]>(['']);
  const [sortField, setSortField] = useState<'nombre' | 'codigo' | 'creado_en'>('creado_en');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchEquipos();
  }, []);

  const handleSort = (field: 'nombre' | 'codigo' | 'creado_en') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  useEffect(() => {
    let filtered = searchTerm
      ? equipos.filter(e =>
          e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [...equipos];

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      
      if (sortField === 'creado_en') {
        aVal = new Date(a.creado_en).getTime();
        bVal = new Date(b.creado_en).getTime();
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();
      return sortDirection === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    setFilteredEquipos(filtered);
  }, [searchTerm, equipos, sortField, sortDirection]);

  const fetchEquipos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/equipos/obtener');
      const data = await response.json();
      
      // Validar que data sea un array
      if (Array.isArray(data)) {
        setEquipos(data);
        setFilteredEquipos(data);
      } else {
        console.error('La respuesta no es un array:', data);
        setEquipos([]);
        setFilteredEquipos([]);
      }
    } catch (error) {
      console.error('Error cargando equipos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los equipos",
        variant: "destructive"
      });
      setEquipos([]);
      setFilteredEquipos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (equipo: Equipo) => {
    setCurrentEquipo(equipo);
    setIntegrantesList(equipo.integrantes?.map(i => i.nombre) || ['']);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEquipo({});
    setIntegrantesList(['']);
  };

  const handleAddIntegrante = () => {
    setIntegrantesList([...integrantesList, '']);
  };

  const handleRemoveIntegrante = (index: number) => {
    const newList = integrantesList.filter((_, i) => i !== index);
    setIntegrantesList(newList.length > 0 ? newList : ['']);
  };

  const handleIntegranteChange = (index: number, value: string) => {
    const newList = [...integrantesList];
    newList[index] = value;
    setIntegrantesList(newList);
  };

  const handleSaveEquipo = async () => {
    try {
      setIsSaving(true);

      if (!currentEquipo.nombre) {
        toast({
          title: "Error",
          description: "El nombre del equipo es requerido",
          variant: "destructive"
        });
        return;
      }

      const integrantes = integrantesList.filter(nombre => nombre.trim() !== '');
      if (integrantes.length === 0) {
        toast({
          title: "Error",
          description: "Debe haber al menos un integrante",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`/api/equipos/actualizar/${currentEquipo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre: currentEquipo.nombre,
          integrantes 
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Éxito",
          description: "Equipo actualizado correctamente"
        });
        handleCloseModal();
        fetchEquipos();
      } else {
        throw new Error(data.error || 'Error al guardar');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el equipo",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEquipo = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este equipo? Se eliminarán todos sus integrantes.')) {
      return;
    }

    try {
      const response = await fetch(`/api/equipos/eliminar/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Éxito",
          description: "Equipo eliminado correctamente"
        });
        fetchEquipos();
      } else {
        throw new Error(data.mensaje || data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el equipo",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
          <p className="text-gray-700">Cargando equipos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Equipos</h1>
        <p className="text-gray-700 mt-2">
          Consulta todos los equipos registrados y sus integrantes
        </p>
      </div>

      {/* Búsqueda */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre de equipo o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Equipos */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900">
            Equipos Registrados ({filteredEquipos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-900 font-semibold cursor-pointer hover:bg-gray-50" onClick={() => handleSort('nombre')}>
                    <div className="flex items-center gap-1">
                      Nombre del Equipo
                      {sortField === 'nombre' && (
                        <span className="text-brand-gold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold cursor-pointer hover:bg-gray-50" onClick={() => handleSort('codigo')}>
                    <div className="flex items-center gap-1">
                      Código
                      {sortField === 'codigo' && (
                        <span className="text-brand-gold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold">Integrantes</TableHead>
                  <TableHead className="text-gray-900 font-semibold cursor-pointer hover:bg-gray-50" onClick={() => handleSort('creado_en')}>
                    <div className="flex items-center gap-1">
                      Fecha de Registro
                      {sortField === 'creado_en' && (
                        <span className="text-brand-gold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-700">
                      No se encontraron equipos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEquipos.map((equipo) => (
                    <TableRow key={equipo.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-brand-gold" />
                          <span className="font-semibold text-gray-900">{equipo.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono bg-gray-900 text-white border-gray-600">
                          {equipo.codigo || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {equipo.integrantes && equipo.integrantes.length > 0 ? (
                            equipo.integrantes.map((integrante, idx) => (
                              <div key={integrante.id} className="flex items-center gap-1 text-sm">
                                <User className="h-3 w-3 text-gray-600" />
                                <span className="text-gray-900">{integrante.nombre}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-gray-700">Sin integrantes</span>
                          )}
                          <Badge variant="secondary" className="mt-1">
                            {equipo.integrantes?.length || 0} miembros
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Calendar className="h-3 w-3 text-gray-600" />
                          {format(new Date(equipo.creado_en), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenModal(equipo)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteEquipo(equipo.id)}
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

      {/* Modal de Edición */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Equipo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Equipo *</Label>
              <Input
                id="nombre"
                value={currentEquipo.nombre || ''}
                onChange={(e) => setCurrentEquipo({...currentEquipo, nombre: e.target.value})}
                placeholder="Nombre del equipo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo">Código (Solo lectura)</Label>
              <Input
                id="codigo"
                value={currentEquipo.codigo || 'N/A'}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Integrantes *</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddIntegrante}
                >
                  Agregar Integrante
                </Button>
              </div>

              {integrantesList.map((integrante, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={integrante}
                    onChange={(e) => handleIntegranteChange(index, e.target.value)}
                    placeholder={`Integrante ${index + 1}`}
                  />
                  {integrantesList.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleRemoveIntegrante(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEquipo} disabled={isSaving}>
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
