-- Corrige un typo evidente de datos (año 4000) antes de poder validar
-- fecha_nacimiento con un check retroactivo.
update alumnos set fecha_nacimiento = '2000-06-07' where fecha_nacimiento = '4000-06-07';

alter table alumnos
  add column tiene_whatsapp boolean not null default false;

alter table alumnos
  add constraint alumnos_telefono_formato
    check (telefono is null or telefono ~ '^[0-9]{9}$'),
  add constraint alumnos_telefono_apoderado_formato
    check (telefono_apoderado is null or telefono_apoderado ~ '^[0-9]{9}$'),
  add constraint alumnos_fecha_nacimiento_valida
    check (fecha_nacimiento is null or fecha_nacimiento <= current_date);

-- crear_alumno_con_matricula pasa a incluir tiene_whatsapp.
drop function if exists crear_alumno_con_matricula(
  text, text, text, date, text, text, text, text, uuid, text, uuid, numeric, date
);

create or replace function crear_alumno_con_matricula(
  p_nombres text,
  p_apellidos text,
  p_dni text,
  p_fecha_nacimiento date,
  p_telefono text,
  p_telefono_apoderado text,
  p_tiene_whatsapp boolean,
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
    telefono_apoderado, tiene_whatsapp, direccion, turno, carrera_id, foto_url
  )
  values (
    p_nombres, p_apellidos, p_dni, p_fecha_nacimiento, p_telefono,
    p_telefono_apoderado, p_tiene_whatsapp, p_direccion, p_turno, p_carrera_id, p_foto_url
  )
  returning id into v_alumno_id;

  insert into matriculas (alumno_id, ciclo_id, monto_pactado, fecha_matricula)
  values (v_alumno_id, p_ciclo_id, p_monto_pactado, p_fecha_matricula)
  returning id into v_matricula_id;

  return query select v_alumno_id, v_matricula_id;
end;
$$;

grant execute on function crear_alumno_con_matricula to authenticated;
