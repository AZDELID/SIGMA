-- SIGMA: esquema inicial (ciclos, alumnos, matrículas, pagos, asistencia)
-- Aplicar con: supabase db push, o pegar en el SQL Editor del proyecto.

create extension if not exists "pgcrypto";

-- ============================================================
-- ciclos: los periodos/planes que ofrece la academia (ej. "Ciclo Verano 2026")
-- ============================================================
create table ciclos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  fecha_inicio date not null,
  fecha_fin date not null,
  monto_default numeric(10, 2) not null check (monto_default >= 0),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  constraint fechas_validas check (fecha_fin >= fecha_inicio)
);

-- ============================================================
-- alumnos: datos personales, independientes del ciclo
-- ============================================================
create table alumnos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nombres text not null,
  apellidos text not null,
  dni text,
  fecha_nacimiento date,
  telefono text,
  telefono_apoderado text,
  direccion text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create index alumnos_nombres_apellidos_idx on alumnos (apellidos, nombres);

-- Código autogenerado (AL00001, AL00002, ...) si no se especifica uno al insertar.
create sequence alumnos_codigo_seq start 1;

create or replace function set_alumno_codigo()
returns trigger as $$
begin
  if new.codigo is null or new.codigo = '' then
    new.codigo := 'AL' || lpad(nextval('alumnos_codigo_seq')::text, 5, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_set_alumno_codigo
before insert on alumnos
for each row execute function set_alumno_codigo();

-- ============================================================
-- matriculas: un alumno inscrito en un ciclo, con el monto pactado
-- (el monto puede diferir del monto_default del ciclo por becas/descuentos)
-- ============================================================
create table matriculas (
  id uuid primary key default gen_random_uuid(),
  alumno_id uuid not null references alumnos (id) on delete restrict,
  ciclo_id uuid not null references ciclos (id) on delete restrict,
  monto_pactado numeric(10, 2) not null check (monto_pactado >= 0),
  fecha_matricula date not null default current_date,
  created_at timestamptz not null default now(),
  unique (alumno_id, ciclo_id)
);

create index matriculas_alumno_idx on matriculas (alumno_id);
create index matriculas_ciclo_idx on matriculas (ciclo_id);

-- ============================================================
-- pagos: abonos contra una matrícula (pago único por ciclo, en abonos libres)
-- ============================================================
create table pagos (
  id uuid primary key default gen_random_uuid(),
  matricula_id uuid not null references matriculas (id) on delete restrict,
  monto numeric(10, 2) not null check (monto > 0),
  fecha_pago date not null default current_date,
  metodo_pago text not null default 'efectivo'
    check (metodo_pago in ('efectivo', 'yape', 'plin', 'transferencia', 'otro')),
  numero_comprobante text,
  observacion text,
  created_at timestamptz not null default now()
);

create index pagos_matricula_idx on pagos (matricula_id);

-- ============================================================
-- asistencias: marcado de ingreso en puerta
-- ============================================================
create table asistencias (
  id uuid primary key default gen_random_uuid(),
  alumno_id uuid not null references alumnos (id) on delete cascade,
  marcado_en timestamptz not null default now(),
  metodo text not null default 'manual' check (metodo in ('codigo', 'manual')),
  created_at timestamptz not null default now()
);

create index asistencias_alumno_idx on asistencias (alumno_id);
create index asistencias_marcado_en_idx on asistencias (marcado_en);

-- ============================================================
-- vista de resumen: deuda pendiente por matrícula
-- ============================================================
create view matriculas_resumen as
select
  m.id as matricula_id,
  m.alumno_id,
  a.codigo as alumno_codigo,
  a.nombres as alumno_nombres,
  a.apellidos as alumno_apellidos,
  m.ciclo_id,
  c.nombre as ciclo_nombre,
  m.monto_pactado,
  coalesce(sum(p.monto), 0) as total_pagado,
  m.monto_pactado - coalesce(sum(p.monto), 0) as saldo_pendiente,
  m.fecha_matricula
from matriculas m
join alumnos a on a.id = m.alumno_id
join ciclos c on c.id = m.ciclo_id
left join pagos p on p.matricula_id = m.id
group by m.id, a.codigo, a.nombres, a.apellidos, c.nombre;

-- Sin esto la vista se ejecuta con los permisos del dueño (bypassa RLS);
-- con security_invoker aplica las políticas del usuario que consulta.
alter view matriculas_resumen set (security_invoker = on);

-- ============================================================
-- crear_alumno_con_matricula: inserta alumno + su matrícula inicial
-- en una sola transacción (evita alumnos huérfanos sin matrícula
-- si la segunda inserción falla).
-- ============================================================
create or replace function crear_alumno_con_matricula(
  p_nombres text,
  p_apellidos text,
  p_dni text,
  p_fecha_nacimiento date,
  p_telefono text,
  p_telefono_apoderado text,
  p_direccion text,
  p_ciclo_id uuid,
  p_monto_pactado numeric,
  p_fecha_matricula date
) returns table (alumno_id uuid, matricula_id uuid)
language plpgsql
security invoker
as $$
declare
  v_alumno_id uuid;
  v_matricula_id uuid;
begin
  insert into alumnos (nombres, apellidos, dni, fecha_nacimiento, telefono, telefono_apoderado, direccion)
  values (p_nombres, p_apellidos, p_dni, p_fecha_nacimiento, p_telefono, p_telefono_apoderado, p_direccion)
  returning id into v_alumno_id;

  insert into matriculas (alumno_id, ciclo_id, monto_pactado, fecha_matricula)
  values (v_alumno_id, p_ciclo_id, p_monto_pactado, p_fecha_matricula)
  returning id into v_matricula_id;

  return query select v_alumno_id, v_matricula_id;
end;
$$;

grant execute on function crear_alumno_con_matricula to authenticated;

-- ============================================================
-- RLS: un solo rol de aplicación. Cualquier usuario autenticado
-- (login de recepción/dirección) tiene acceso completo; sin sesión, nada.
-- ============================================================
alter table ciclos enable row level security;
alter table alumnos enable row level security;
alter table matriculas enable row level security;
alter table pagos enable row level security;
alter table asistencias enable row level security;

create policy "authenticated_full_access" on ciclos
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on alumnos
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on matriculas
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on pagos
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on asistencias
  for all to authenticated using (true) with check (true);
