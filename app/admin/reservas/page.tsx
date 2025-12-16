'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Calendar, User, Mail, Phone, DoorOpen, Clock, CheckCircle, XCircle, Edit, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface Reserva {
  id: number;
  cliente: string;
  correo: string;
  telefono: string;
  sala_id: number;
  horario_id: number;
  fecha: string;
  cantidad_jugadores: number;
  estado: string;
  metodo_pago: string;
  precio_total: number;
  activo: boolean;
  horario: { hora: string };
  sala: { nombre: string };
}

export default function ReservasPage() {
  const { toast } = useToast();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filteredReservas, setFilteredReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todas');
  const [filterSala, setFilterSala] = useState<string>('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentReserva, setCurrentReserva] = useState<Partial<Reserva>>({});
  const [horarios, setHorarios] = useState<any[]>([]);
  const [sortField, setSortField] = useState<'fecha' | 'cliente' | 'cantidad_jugadores' | 'precio_total'>('fecha');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchReservas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterEstado, filterSala, reservas, sortField, sortDirection]);

  const fetchReservas = async () => {
    try {
      const response = await fetch('/api/reservas/obtener');
      const result = await response.json();
      
      // La API devuelve { data: [...] }
      const data = result.data || [];
      
      if (Array.isArray(data)) {
        setReservas(data);
        setFilteredReservas(data);
      } else {
        console.error('La respuesta no contiene un array válido:', result);
        setReservas([]);
        setFilteredReservas([]);
      }
    } catch (error) {
      console.error('Error cargando reservas:', error);
      setReservas([]);
      setFilteredReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: 'fecha' | 'cliente' | 'cantidad_jugadores' | 'precio_total') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const applyFilters = () => {
    let filtered = [...reservas];

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.telefono.includes(searchTerm)
      );
    }

    // Filtro por estado
    if (filterEstado !== 'todas') {
      filtered = filtered.filter(r => r.estado === filterEstado);
    }

    // Filtro por sala
    if (filterSala !== 'todas') {
      filtered = filtered.filter(r => r.sala_id === parseInt(filterSala));
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      
      if (sortField === 'fecha') {
        aVal = new Date(a.fecha + 'T00:00:00').getTime();
        bVal = new Date(b.fecha + 'T00:00:00').getTime();
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortDirection === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    setFilteredReservas(filtered);
  };

  const handleEstadoChange = async (reservaId: number, nuevoEstado: string) => {
    try {
      const reserva = reservas.find(r => r.id === reservaId);
      if (!reserva) return;

      const response = await fetch(`/api/reservas/actualizar/${reservaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reserva: {
            ...reserva,
            estado: nuevoEstado
          }
        })
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Estado cambiado a ${nuevoEstado}`
        });
        fetchReservas();
      }
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive"
      });
    }
  };

  const handleOpenModal = async (reserva: Reserva) => {
    setCurrentReserva(reserva);
    
    // Cargar horarios disponibles para la sala
    try {
      const response = await fetch('/api/horarios/obtener');
      const data = await response.json();
      const horariosFiltered = data.data.filter((h: any) => h.sala_id === reserva.sala_id);
      setHorarios(horariosFiltered);
    } catch (error) {
      console.error('Error cargando horarios:', error);
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentReserva({});
    setHorarios([]);
  };

  const handleSaveReserva = async () => {
    try {
      setIsSaving(true);

      if (!currentReserva.cliente || !currentReserva.correo || !currentReserva.telefono) {
        toast({
          title: "Error",
          description: "Cliente, correo y teléfono son requeridos",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`/api/reservas/actualizar/${currentReserva.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reserva: currentReserva })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Éxito",
          description: "Reserva actualizada correctamente"
        });
        handleCloseModal();
        fetchReservas();
      } else {
        throw new Error(data.error || 'Error al guardar');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la reserva",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pendiente: { label: 'Pendiente', variant: 'secondary' },
      confirmada: { label: 'Confirmada', variant: 'default' },
      cancelada: { label: 'Cancelada', variant: 'destructive' }
    };
    
    const config = estados[estado] || { label: estado, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
          <p className="text-gray-700">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Reservas</h1>
        <p className="text-gray-700 mt-2">
          Administra todas las reservas de los escape rooms
        </p>
      </div>

      {/* Filtros */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Filter className="h-5 w-5 text-brand-gold" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por cliente, correo o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro Estado */}
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro Sala */}
            <Select value={filterSala} onValueChange={setFilterSala}>
              <SelectTrigger>
                <SelectValue placeholder="Sala" />
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

      {/* Tabla de Reservas */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900">
            Reservas ({filteredReservas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-900 font-semibold cursor-pointer hover:bg-gray-50" onClick={() => handleSort('cliente')}>
                    <div className="flex items-center gap-1">
                      Cliente
                      {sortField === 'cliente' && (
                        <span className="text-brand-gold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold">Contacto</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Sala</TableHead>
                  <TableHead className="text-gray-900 font-semibold cursor-pointer hover:bg-gray-50" onClick={() => handleSort('fecha')}>
                    <div className="flex items-center gap-1">
                      Fecha y Hora
                      {sortField === 'fecha' && (
                        <span className="text-brand-gold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold cursor-pointer hover:bg-gray-50" onClick={() => handleSort('cantidad_jugadores')}>
                    <div className="flex items-center gap-1">
                      Jugadores
                      {sortField === 'cantidad_jugadores' && (
                        <span className="text-brand-gold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold cursor-pointer hover:bg-gray-50" onClick={() => handleSort('precio_total')}>
                    <div className="flex items-center gap-1">
                      Pago
                      {sortField === 'precio_total' && (
                        <span className="text-brand-gold">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-semibold">Total</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Estado</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-700">
                      No se encontraron reservas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservas.map((reserva) => (
                    <TableRow key={reserva.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-gray-900">{reserva.cliente}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-gray-600" />
                            <span className="text-gray-900">{reserva.correo}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-600" />
                            <span className="text-gray-900">{reserva.telefono}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DoorOpen className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-900">{reserva.sala.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-600" />
                            <span className="text-gray-900">{format(new Date(reserva.fecha + 'T00:00:00'), 'dd/MM/yyyy', { locale: es })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-600" />
                            <span className="text-gray-900">{reserva.horario?.hora?.slice(0, 5) || 'N/A'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                          <User className="h-3 w-3 mr-1" />
                          {reserva.cantidad_jugadores}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm capitalize text-gray-900">{reserva.metodo_pago}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-gray-900">S/ {reserva.precio_total}</span>
                      </TableCell>
                      <TableCell>
                        {getEstadoBadge(reserva.estado)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenModal(reserva)}
                            title="Editar reserva"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {reserva.estado === 'pendiente' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEstadoChange(reserva.id, 'confirmada')}
                              className="text-green-600 hover:text-green-700"
                              title="Confirmar"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {reserva.estado !== 'cancelada' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEstadoChange(reserva.id, 'cancelada')}
                              className="text-red-600 hover:text-red-700"
                              title="Cancelar"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
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
            <DialogTitle>Editar Reserva</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Nombre del Cliente *</Label>
                <Input
                  id="cliente"
                  value={currentReserva.cliente || ''}
                  onChange={(e) => setCurrentReserva({...currentReserva, cliente: e.target.value})}
                  placeholder="Nombre completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={currentReserva.telefono || ''}
                  onChange={(e) => setCurrentReserva({...currentReserva, telefono: e.target.value})}
                  placeholder="+51 999 999 999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electrónico *</Label>
              <Input
                id="correo"
                type="email"
                value={currentReserva.correo || ''}
                onChange={(e) => setCurrentReserva({...currentReserva, correo: e.target.value})}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={currentReserva.fecha ? new Date(currentReserva.fecha + 'T00:00:00').toISOString().split('T')[0] : ''}
                  onChange={(e) => setCurrentReserva({...currentReserva, fecha: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horario">Horario</Label>
                <Select 
                  value={currentReserva.horario_id?.toString()} 
                  onValueChange={(value) => setCurrentReserva({...currentReserva, horario_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar horario" />
                  </SelectTrigger>
                  <SelectContent>
                    {horarios.map((h: any) => (
                      <SelectItem key={h.id} value={h.id.toString()}>
                        {h.hora.slice(0, 5)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cantidad" className="text-gray-900 font-medium">Cantidad de Jugadores</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="1"
                  value={currentReserva.cantidad_jugadores || ''}
                  onChange={(e) => setCurrentReserva({...currentReserva, cantidad_jugadores: parseInt(e.target.value)})}
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precio">Precio Total (S/)</Label>
                <Input
                  id="precio"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentReserva.precio_total || ''}
                  onChange={(e) => setCurrentReserva({...currentReserva, precio_total: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metodo_pago">Método de Pago</Label>
                <Select 
                  value={currentReserva.metodo_pago} 
                  onValueChange={(value) => setCurrentReserva({...currentReserva, metodo_pago: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="yape">Yape</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select 
                  value={currentReserva.estado} 
                  onValueChange={(value) => setCurrentReserva({...currentReserva, estado: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="confirmada">Confirmada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <p className="text-sm text-gray-900">
                <strong>Sala:</strong> {currentReserva.sala?.nombre}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSaveReserva} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>Guardar Cambios</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
