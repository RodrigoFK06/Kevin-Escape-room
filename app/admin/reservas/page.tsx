'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Calendar, User, Mail, Phone, DoorOpen, Clock, CheckCircle, XCircle, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filteredReservas, setFilteredReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todas');
  const [filterSala, setFilterSala] = useState<string>('todas');

  useEffect(() => {
    fetchReservas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterEstado, filterSala, reservas]);

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
        fetchReservas();
      }
    } catch (error) {
      console.error('Error actualizando reserva:', error);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reservas...</p>
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
                  <TableHead className="text-gray-900 font-semibold">Cliente</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Contacto</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Sala</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Fecha y Hora</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Jugadores</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Pago</TableHead>
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
                            <span className="text-gray-900">{format(new Date(reserva.fecha), 'dd/MM/yyyy', { locale: es })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-600" />
                            <span className="text-gray-900">{reserva.horario.hora.slice(0, 5)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{reserva.cantidad_jugadores}</Badge>
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
                          {reserva.estado === 'pendiente' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEstadoChange(reserva.id, 'confirmada')}
                              className="text-green-600 hover:text-green-700"
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
    </div>
  );
}
