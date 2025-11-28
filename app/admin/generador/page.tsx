'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Ticket, Copy, Check, Users, Clock, Trophy, Calendar, QrCode, DoorOpen } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Equipo {
  id: number;
  nombre: string;
  codigo: string;
}

interface Sala {
  id: number;
  nombre: string;
}

export default function GeneradorPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEquipos, setFilteredEquipos] = useState<Equipo[]>([]);
  
  // Form Data
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null);
  const [salaId, setSalaId] = useState('');
  const [puntaje, setPuntaje] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [integrantes, setIntegrantes] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  
  // Output
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchEquipos();
    fetchSalas();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = equipos.filter(e =>
        e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEquipos(filtered);
    } else {
      setFilteredEquipos([]);
    }
  }, [searchTerm, equipos]);

  const fetchEquipos = async () => {
    try {
      const response = await fetch('/api/equipos/obtener');
      const data = await response.json();
      if (Array.isArray(data)) {
        setEquipos(data);
      }
    } catch (error) {
      console.error('Error cargando equipos:', error);
    }
  };

  const fetchSalas = async () => {
    // Mock data por ahora
    setSalas([
      { id: 1, nombre: 'El Paciente 136' },
      { id: 2, nombre: 'El Último Conjuro' },
      { id: 3, nombre: 'La Secuencia Perdida' }
    ]);
  };

  const selectEquipo = (equipo: Equipo) => {
    setSelectedEquipo(equipo);
    setSearchTerm('');
    setFilteredEquipos([]);
    
    // Auto-llenar integrantes si está disponible
    if (equipo.integrantes?.length) {
      setIntegrantes(equipo.integrantes.length.toString());
    }
  };

  const generarCodigo = async () => {
    if (!selectedEquipo || !salaId || !puntaje || !tiempo || !integrantes) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      // Crear el payload con los datos
      const payload = {
        equipoId: selectedEquipo.id,
        equipoCodigo: selectedEquipo.codigo,
        salaId: parseInt(salaId),
        puntaje: parseInt(puntaje),
        tiempo: parseInt(tiempo),
        integrantes: parseInt(integrantes),
        fecha: fecha
      };

      const response = await fetch('/api/generador/crear-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.codigo) {
        setCodigoGenerado(result.codigo);
      } else {
        alert('Error generando código');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generando código');
    } finally {
      setLoading(false);
    }
  };

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(codigoGenerado);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copiando:', error);
    }
  };

  const limpiarFormulario = () => {
    setSelectedEquipo(null);
    setSalaId('');
    setPuntaje('');
    setTiempo('');
    setIntegrantes('');
    setFecha(new Date().toISOString().split('T')[0]);
    setCodigoGenerado('');
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Ticket className="h-8 w-8 text-brand-gold" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Generador de Códigos</h1>
            <p className="text-gray-700 mt-1">
              Genera códigos seguros para registrar resultados de equipos
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de Generación */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-gold" />
              Datos del Resultado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Búsqueda de Equipo */}
            <div>
              <Label className="text-gray-900 font-semibold">Buscar Equipo *</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                <Input
                  placeholder="Buscar por nombre o código de equipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={!!selectedEquipo}
                />
              </div>
              
              {/* Lista de resultados */}
              {filteredEquipos.length > 0 && !selectedEquipo && (
                <div className="mt-2 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {filteredEquipos.map((equipo) => (
                    <button
                      key={equipo.id}
                      onClick={() => selectEquipo(equipo)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-200 last:border-0 transition-colors"
                    >
                      <div className="font-semibold text-gray-900">{equipo.nombre}</div>
                      <div className="text-sm text-gray-600">Código: {equipo.codigo}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Equipo Seleccionado */}
              {selectedEquipo && (
                <Alert className="mt-2 bg-green-50 border-green-300">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-gray-900">
                    <strong>{selectedEquipo.nombre}</strong> ({selectedEquipo.codigo})
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedEquipo(null)}
                      className="ml-2 h-6 text-gray-700 hover:text-gray-900"
                    >
                      Cambiar
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Sala */}
            <div>
              <Label className="text-gray-900 font-semibold flex items-center gap-2">
                <DoorOpen className="h-4 w-4 text-gray-600" />
                Sala *
              </Label>
              <Select value={salaId} onValueChange={setSalaId}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Seleccionar sala" />
                </SelectTrigger>
                <SelectContent>
                  {salas.map((sala) => (
                    <SelectItem key={sala.id} value={sala.id.toString()}>
                      {sala.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Puntaje */}
            <div>
              <Label className="text-gray-900 font-semibold flex items-center gap-2">
                <Trophy className="h-4 w-4 text-gray-600" />
                Puntaje *
              </Label>
              <Input
                type="number"
                placeholder="Ej: 1000"
                value={puntaje}
                onChange={(e) => setPuntaje(e.target.value)}
                min="0"
                className="mt-2"
              />
            </div>

            {/* Tiempo */}
            <div>
              <Label className="text-gray-900 font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                Tiempo (minutos) *
              </Label>
              <Input
                type="number"
                placeholder="Ej: 50"
                value={tiempo}
                onChange={(e) => setTiempo(e.target.value)}
                min="1"
                className="mt-2"
              />
            </div>

            {/* Integrantes */}
            <div>
              <Label className="text-gray-900 font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                Cantidad de Integrantes *
              </Label>
              <Input
                type="number"
                placeholder="Ej: 4"
                value={integrantes}
                onChange={(e) => setIntegrantes(e.target.value)}
                min="1"
                className="mt-2"
              />
            </div>

            {/* Fecha */}
            <div>
              <Label className="text-gray-900 font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                Fecha *
              </Label>
              <Input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={generarCodigo}
                disabled={loading || !selectedEquipo}
                className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-semibold"
              >
                {loading ? 'Generando...' : 'Generar Código'}
              </Button>
              <Button
                onClick={limpiarFormulario}
                variant="outline"
                className="text-gray-900"
              >
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultado - Código Generado */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <QrCode className="h-5 w-5 text-brand-gold" />
              Código Generado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!codigoGenerado ? (
              <div className="text-center py-12">
                <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Completa el formulario para generar un código
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Código Grande */}
                <div className="bg-gradient-to-br from-brand-gold/10 to-amber-50 border-2 border-brand-gold rounded-lg p-6">
                  <Label className="text-gray-700 text-sm font-semibold mb-2 block">
                    Código de Resultado:
                  </Label>
                  <div className="bg-white rounded-lg p-4 border border-gray-300">
                    <p className="text-2xl font-mono font-bold text-gray-900 break-all text-center">
                      {codigoGenerado}
                    </p>
                  </div>
                </div>

                {/* Resumen de Datos */}
                <div className="border border-gray-300 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">Resumen:</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Equipo:</span>
                      <p className="font-semibold text-gray-900">{selectedEquipo?.nombre}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Código:</span>
                      <p className="font-semibold text-gray-900">{selectedEquipo?.codigo}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Sala:</span>
                      <p className="font-semibold text-gray-900">
                        {salas.find(s => s.id === parseInt(salaId))?.nombre}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Puntaje:</span>
                      <p className="font-semibold text-gray-900">{puntaje} pts</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tiempo:</span>
                      <p className="font-semibold text-gray-900">{tiempo} min</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Integrantes:</span>
                      <p className="font-semibold text-gray-900">{integrantes}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Fecha:</span>
                      <p className="font-semibold text-gray-900">{fecha}</p>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-3">
                  <Button
                    onClick={copiarCodigo}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Código
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => window.print()}
                    variant="outline"
                    className="text-gray-900"
                  >
                    Imprimir
                  </Button>
                </div>

                <Alert className="bg-blue-50 border-blue-300">
                  <AlertDescription className="text-gray-900 text-sm">
                    <strong>Instrucciones:</strong> Entrega este código al equipo para que lo ingresen 
                    en el formulario público de registro de resultados.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información de Ayuda */}
      <Card className="bg-amber-50 border-amber-300">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-900 mb-2">ℹ️ Cómo usar este módulo:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-800">
            <li>Busca y selecciona el equipo que acaba de completar la sala</li>
            <li>Selecciona la sala que jugaron</li>
            <li>Ingresa el puntaje, tiempo y número de integrantes</li>
            <li>Haz clic en "Generar Código"</li>
            <li>Copia o imprime el código y entrégalo al equipo</li>
            <li>El equipo ingresará este código en el formulario público para registrar su resultado</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
