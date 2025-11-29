'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [filteredEquipos, setFilteredEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEquipos();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = equipos.filter(e =>
        e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEquipos(filtered);
    } else {
      setFilteredEquipos(equipos);
    }
  }, [searchTerm, equipos]);

  const fetchEquipos = async () => {
    try {
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
      setEquipos([]);
      setFilteredEquipos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando equipos...</p>
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
                  <TableHead className="text-gray-900 font-semibold">Nombre del Equipo</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Código</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Integrantes</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Fecha de Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-700">
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
                        <Badge variant="outline" className="font-mono bg-gray-100 text-gray-900 border-gray-300">
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
