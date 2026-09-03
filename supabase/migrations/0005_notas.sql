-- Módulo de notas: simulacros con varias materias, puntaje por alumno,
-- convertido a nota sobre 20 con regla de tres simple
-- (nota = puntaje_obtenido / puntaje_maximo * 20).

create table materias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  created_at timestamptz not null default now()
);

create table simulacros (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  fecha date not null default current_date,
  ciclo_id uuid not null references ciclos (id) on delete restrict,
  created_at timestamptz not null default now()
);

create index simulacros_ciclo_idx on simulacros (ciclo_id);

-- Las materias que entran en un simulacro concreto, con su puntaje máximo
-- (puede variar de un simulacro a otro para la misma materia).
create table simulacro_materias (
  id uuid primary key default gen_random_uuid(),
  simulacro_id uuid not null references simulacros (id) on delete cascade,
  materia_id uuid not null references materias (id) on delete restrict,
  puntaje_maximo numeric(10, 2) not null check (puntaje_maximo > 0),
  created_at timestamptz not null default now(),
  unique (simulacro_id, materia_id)
);

-- Puntaje obtenido por un alumno en una materia de un simulacro.
create table resultados (
  id uuid primary key default gen_random_uuid(),
  simulacro_materia_id uuid not null references simulacro_materias (id) on delete cascade,
  alumno_id uuid not null references alumnos (id) on delete cascade,
  puntaje_obtenido numeric(10, 2) not null check (puntaje_obtenido >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (simulacro_materia_id, alumno_id)
);

create index resultados_alumno_idx on resultados (alumno_id);

-- ============================================================
-- resultados_detalle: cada resultado con su nota ya calculada
-- ============================================================
create view resultados_detalle as
select
  r.id as resultado_id,
  r.alumno_id,
  a.nombres as alumno_nombres,
  a.apellidos as alumno_apellidos,
  sm.id as simulacro_materia_id,
  s.id as simulacro_id,
  s.nombre as simulacro_nombre,
  s.fecha as simulacro_fecha,
  s.ciclo_id,
  m.id as materia_id,
  m.nombre as materia_nombre,
  sm.puntaje_maximo,
  r.puntaje_obtenido,
  round(r.puntaje_obtenido / sm.puntaje_maximo * 20, 2) as nota
from resultados r
join simulacro_materias sm on sm.id = r.simulacro_materia_id
join materias m on m.id = sm.materia_id
join simulacros s on s.id = sm.simulacro_id
join alumnos a on a.id = r.alumno_id;

alter view resultados_detalle set (security_invoker = on);

-- ============================================================
-- notas_finales_simulacro: nota final por alumno = promedio de las
-- notas de todas las materias que rindió en ese simulacro.
-- ============================================================
create view notas_finales_simulacro as
select
  simulacro_id,
  simulacro_nombre,
  simulacro_fecha,
  ciclo_id,
  alumno_id,
  alumno_nombres,
  alumno_apellidos,
  count(*) as materias_rendidas,
  round(avg(nota), 2) as nota_final
from resultados_detalle
group by simulacro_id, simulacro_nombre, simulacro_fecha, ciclo_id, alumno_id, alumno_nombres, alumno_apellidos;

alter view notas_finales_simulacro set (security_invoker = on);

-- ============================================================
-- RLS
-- ============================================================
alter table materias enable row level security;
alter table simulacros enable row level security;
alter table simulacro_materias enable row level security;
alter table resultados enable row level security;

create policy "authenticated_full_access" on materias
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on simulacros
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on simulacro_materias
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on resultados
  for all to authenticated using (true) with check (true);
