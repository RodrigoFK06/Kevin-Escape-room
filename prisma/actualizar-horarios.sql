-- Script para actualizar los horarios de todas las salas
-- Nuevos horarios: 11:00, 12:30, 14:00, 15:30, 17:00, 18:30, 20:00, 21:30

-- Primero eliminar todos los horarios existentes
DELETE FROM horario;

-- Resetear el auto_increment
ALTER TABLE horario AUTO_INCREMENT = 1;

-- Insertar nuevos horarios para cada sala (asumiendo que hay 3 salas con IDs 1, 2, 3)
-- Sala 1: El Paciente 136
INSERT INTO horario (sala_id, hora) VALUES
(1, '11:00:00'),
(1, '12:30:00'),
(1, '14:00:00'),
(1, '15:30:00'),
(1, '17:00:00'),
(1, '18:30:00'),
(1, '20:00:00'),
(1, '21:30:00');

-- Sala 2: El Último Conjuro
INSERT INTO horario (sala_id, hora) VALUES
(2, '11:00:00'),
(2, '12:30:00'),
(2, '14:00:00'),
(2, '15:30:00'),
(2, '17:00:00'),
(2, '18:30:00'),
(2, '20:00:00'),
(2, '21:30:00');

-- Sala 3: La Secuencia Perdida
INSERT INTO horario (sala_id, hora) VALUES
(3, '11:00:00'),
(3, '12:30:00'),
(3, '14:00:00'),
(3, '15:30:00'),
(3, '17:00:00'),
(3, '18:30:00'),
(3, '20:00:00'),
(3, '21:30:00');

-- Si hay más salas, agregar más INSERT statements siguiendo el mismo patrón
-- Verificar cuántas salas hay con:
-- SELECT id, nombre FROM sala;
