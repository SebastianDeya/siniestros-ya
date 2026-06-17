-- =============================================
-- SiniestrosYA - Setup inicial de base de datos
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

-- Tabla de pólizas
create table if not exists polizas (
  id text primary key,
  compania text,
  patente text,
  numero_poliza text,
  tipo_seguro text,
  vehiculo_marca text,
  vehiculo_modelo text,
  vehiculo_anio int,
  asegurado_nombre text,
  asegurado_dni text,
  asegurado_telefono text,
  asegurado_email text,
  created_at timestamptz default now()
);

-- Tabla de siniestros
create table if not exists siniestros (
  id text primary key,
  user_id text,
  numero_seguimiento text,
  en_lugar_hecho boolean,
  hay_heridos boolean,
  ubicacion text,
  ubicacion_lat float8,
  ubicacion_lng float8,
  fecha_siniestro text,
  hora_siniestro text,
  tipo_siniestro text,
  subtipo_choque text,
  descripcion text,
  cantidad_vehiculos int,
  guia_leida boolean,
  compania_aseguradora text,
  numero_poliza text,
  tipo_seguro text,
  vehiculo_marca text,
  vehiculo_modelo text,
  vehiculo_anio int,
  vehiculo_patente text,
  asegurado_nombre text,
  asegurado_dni text,
  asegurado_telefono text,
  asegurado_email text,
  tercero_nombre text,
  tercero_dni text,
  tercero_patente text,
  tercero_aseguradora text,
  estado text,
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- Deshabilitar RLS para demo (acceso público con clave anon)
alter table polizas disable row level security;
alter table siniestros disable row level security;

-- =============================================
-- SEED: Pólizas iniciales
-- =============================================
insert into polizas (id, compania, patente, numero_poliza, tipo_seguro, vehiculo_marca, vehiculo_modelo, vehiculo_anio, asegurado_nombre, asegurado_dni, asegurado_telefono, asegurado_email, created_at) values
('pol-001', 'Allianz Argentina', 'MDG681', '7424723758', 'automotor', 'Fiat', '500', 2014, 'Juan Lopez', '53523523', '11-2222-2222', 'juanlopez@gmail.com', '2026-01-01T00:00:00.000Z'),
('pol-002', 'Sancor Seguros', 'ABC123', 'SAN-99012', 'automotor', 'Toyota', 'Corolla', 2020, 'Maria Garcia', '28345678', '11-5678-9012', 'maria.garcia@gmail.com', '2026-01-01T00:00:00.000Z'),
('pol-003', 'La Caja', 'XYZ789', 'LC-55301', 'automotor', 'Volkswagen', 'Gol', 2018, 'Carlos Perez', '33456789', '11-4444-5555', 'carlos.perez@gmail.com', '2026-01-01T00:00:00.000Z'),
('pol-sd-001', 'Sancor Seguros', 'AF216BO', 'POL8383', 'automotor', 'Toyota', 'SW4', 2022, 'Sebastian Deya', '46003134', '1138444436', 'sebastiandeya88@gmail.com', '2026-01-01T00:00:00.000Z'),
('pol-sd-002', 'Allianz Argentina', 'VW450TK', 'ALZ-20291', 'automotor', 'Volkswagen', 'Taos', 2023, 'Sebastian Deya', '46003134', '1138444436', 'sebastiandeya88@gmail.com', '2026-01-02T00:00:00.000Z'),
('pol-sd-003', 'La Caja', 'AC510AX', 'LC-88102', 'automotor', 'Jeep', 'Renegade', 2021, 'Sebastian Deya', '46003134', '1138444436', 'sebastiandeya88@gmail.com', '2026-01-03T00:00:00.000Z')
on conflict (id) do nothing;

-- =============================================
-- SEED: Siniestros de demo
-- =============================================
insert into siniestros (id, user_id, numero_seguimiento, en_lugar_hecho, hay_heridos, ubicacion, ubicacion_lat, ubicacion_lng, fecha_siniestro, hora_siniestro, tipo_siniestro, subtipo_choque, descripcion, cantidad_vehiculos, guia_leida, compania_aseguradora, numero_poliza, tipo_seguro, vehiculo_marca, vehiculo_modelo, vehiculo_anio, vehiculo_patente, asegurado_nombre, asegurado_dni, asegurado_telefono, asegurado_email, tercero_nombre, tercero_dni, tercero_patente, tercero_aseguradora, estado, created_at, updated_at) values
('sin-sd-001', 'user-sebastiandeya', 'SIN-2026-0041', true, false, 'Av. Cabildo 2300, CABA', -34.5559, -58.4609, '2026-05-10', '09:15', 'choque', 'trasero', 'Me chocaron por atrás en un semáforo en rojo. El tercero no tenía seguro vigente.', 2, true, 'Allianz Argentina', 'ALZ-20291', 'automotor', 'Volkswagen', 'Taos', 2023, 'VW450TK', 'Sebastian Deya', '46003134', '1138444436', 'sebastiandeya88@gmail.com', 'Carlos Ríos', '29881234', 'FGH321', 'La Caja', 'pericia_programada', '2026-05-10T09:30:00.000Z', '2026-05-14T10:00:00.000Z'),
('sin-sd-002', 'user-sebastiandeya', 'SIN-2026-0087', false, false, 'Panamericana Km 28, San Isidro', -34.4731, -58.5148, '2026-06-01', '18:40', 'robo_parcial', '', 'Me robaron el espejo retrovisor y el stereo cuando estaba estacionado en la calle.', 1, true, 'Sancor Seguros', 'POL8383', 'automotor', 'Toyota', 'SW4', 2022, 'AF216BO', 'Sebastian Deya', '46003134', '1138444436', 'sebastiandeya88@gmail.com', '', '', '', '', 'documentacion_pendiente', '2026-06-01T19:00:00.000Z', '2026-06-02T08:00:00.000Z'),
('sin-sd-003', 'user-sebastiandeya', 'SIN-2026-0112', true, false, 'Av. Libertador 5400, Vicente López', -34.5195, -58.4902, '2026-06-14', '14:20', 'choque', 'lateral', 'Choque lateral al doblar en esquina. Ambos vehículos con daños en laterales.', 2, true, 'Allianz Argentina', 'ALZ-20291', 'automotor', 'Volkswagen', 'Taos', 2023, 'VW450TK', 'Sebastian Deya', '46003134', '1138444436', 'sebastiandeya88@gmail.com', 'Marcela Vega', '31445566', 'RZT099', 'Sancor Seguros', 'denuncia_recibida', '2026-06-14T14:35:00.000Z', '2026-06-14T14:35:00.000Z'),
('sin-demo-allianz-1', 'mock-user-123', 'SIN-2026-0033', true, false, 'Av. Corrientes 1200, CABA', null, null, '2026-04-20', '10:00', 'choque', 'trasero', 'Choque por alcance en semáforo.', 2, true, 'Allianz Argentina', '7424723758', 'automotor', 'Fiat', '500', 2014, 'MDG681', 'Juan Lopez', '53523523', '11-2222-2222', 'juanlopez@gmail.com', '', '', '', '', 'caso_cerrado', '2026-04-20T10:15:00.000Z', '2026-05-15T12:00:00.000Z')
on conflict (id) do nothing;
