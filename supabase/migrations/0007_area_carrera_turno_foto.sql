-- Áreas y carreras a las que postulan los alumnos (catálogo fijo dado por
-- el cliente). Turno y foto también se agregan al alumno para el carnet.

create table areas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  orden integer not null
);

create table carreras (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  area_id uuid not null references areas (id) on delete restrict,
  unique (area_id, nombre)
);

create index carreras_area_idx on carreras (area_id);

insert into areas (nombre, orden) values
  ('Ciencias de la Salud', 1),
  ('Ingenierías y Ciencias Agrarias', 2),
  ('Ciencias Económicas y Empresariales', 3),
  ('Ciencias Sociales, Educación y Humanidades', 4);

insert into carreras (nombre, area_id)
select c.nombre, a.id
from areas a
join (values
  ('Ciencias de la Salud', 'Medicina Humana'),
  ('Ciencias de la Salud', 'Odontología'),
  ('Ciencias de la Salud', 'Enfermería'),
  ('Ciencias de la Salud', 'Obstetricia'),
  ('Ingenierías y Ciencias Agrarias', 'Ingeniería Civil'),
  ('Ingenierías y Ciencias Agrarias', 'Ingeniería de Minas'),
  ('Ingenierías y Ciencias Agrarias', 'Ingeniería Ambiental'),
  ('Ingenierías y Ciencias Agrarias', 'Ingeniería Geológica'),
  ('Ingenierías y Ciencias Agrarias', 'Ingeniería Metalúrgica'),
  ('Ingenierías y Ciencias Agrarias', 'Ingeniería de Sistemas y Computación'),
  ('Ingenierías y Ciencias Agrarias', 'Agronomía'),
  ('Ingenierías y Ciencias Agrarias', 'Zootecnia'),
  ('Ingenierías y Ciencias Agrarias', 'Industrias Alimentarias'),
  ('Ciencias Económicas y Empresariales', 'Administración'),
  ('Ciencias Económicas y Empresariales', 'Contabilidad'),
  ('Ciencias Económicas y Empresariales', 'Economía'),
  ('Ciencias Sociales, Educación y Humanidades', 'Derecho y Ciencias Políticas'),
  ('Ciencias Sociales, Educación y Humanidades', 'Ciencias de la Comunicación'),
  ('Ciencias Sociales, Educación y Humanidades', 'Educación Inicial'),
  ('Ciencias Sociales, Educación y Humanidades', 'Educación Primaria'),
  ('Ciencias Sociales, Educación y Humanidades', 'Educación Secundaria')
) as c(area_nombre, nombre) on c.area_nombre = a.nombre;

-- Nullable a propósito: los 3 alumnos ya registrados no tienen estos datos
-- todavía. El formulario de matrícula sí los exige de acá en adelante.
alter table alumnos
  add column turno text check (turno in ('Mañana', 'Tarde', 'Noche')),
  add column carrera_id uuid references carreras (id) on delete restrict,
  add column foto_url text;

-- Bucket de Storage para las fotos procesadas (recortadas, sin fondo).
insert into storage.buckets (id, name, public)
values ('fotos-alumnos', 'fotos-alumnos', true)
on conflict (id) do nothing;

create policy "authenticated_insert_fotos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'fotos-alumnos');

create policy "authenticated_update_fotos" on storage.objects
  for update to authenticated
  using (bucket_id = 'fotos-alumnos');

create policy "authenticated_delete_fotos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'fotos-alumnos');

create policy "public_read_fotos" on storage.objects
  for select
  using (bucket_id = 'fotos-alumnos');

alter table areas enable row level security;
alter table carreras enable row level security;

create policy "authenticated_full_access" on areas
  for all to authenticated using (true) with check (true);

create policy "authenticated_full_access" on carreras
  for all to authenticated using (true) with check (true);

-- Reemplaza crear_alumno_con_matricula para incluir turno, carrera y foto.
drop function if exists crear_alumno_con_matricula(
  text, text, text, date, text, text, text, uuid, numeric, date
);

create or replace function crear_alumno_con_matricula(
  p_nombres text,
  p_apellidos text,
  p_dni text,
  p_fecha_nacimiento date,
  p_telefono text,
  p_telefono_apoderado text,
  p_direccion text,
  p_turno text,
  p_carrera_id uuid,
  p_foto_url text,
  p_ciclo_id uuid,
  p_monto_pactado numeric,
  p_fecha_matricula date
) returns table (alumno_id uuid, matricula_id uuid)
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_alumno_id uuid;
  v_matricula_id uuid;
begin
  insert into alumnos (
    nombres, apellidos, dni, fecha_nacimiento, telefono,
    telefono_apoderado, direccion, turno, carrera_id, foto_url
  )
  values (
    p_nombres, p_apellidos, p_dni, p_fecha_nacimiento, p_telefono,
    p_telefono_apoderado, p_direccion, p_turno, p_carrera_id, p_foto_url
  )
  returning id into v_alumno_id;

  insert into matriculas (alumno_id, ciclo_id, monto_pactado, fecha_matricula)
  values (v_alumno_id, p_ciclo_id, p_monto_pactado, p_fecha_matricula)
  returning id into v_matricula_id;

  return query select v_alumno_id, v_matricula_id;
end;
$$;

grant execute on function crear_alumno_con_matricula to authenticated;
