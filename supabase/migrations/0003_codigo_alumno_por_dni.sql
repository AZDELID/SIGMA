-- El código de alumno pasa de ser secuencial (AL00001...) a estar
-- basado en DNI: los 2 últimos dígitos del año de registro + el DNI
-- (ej. año 2026, DNI 71447115 -> código 2671447115). Esto exige que
-- dni sea obligatorio y único.

update alumnos
set dni = lpad(dni, 8, '0')
where dni is not null and length(dni) < 8;

alter table alumnos
  alter column dni set not null,
  add constraint alumnos_dni_key unique (dni),
  add constraint alumnos_dni_formato check (dni ~ '^[0-9]{8}$');

create or replace function set_alumno_codigo()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.codigo is null or new.codigo = '' then
    new.codigo := to_char(current_date, 'YY') || new.dni;
  end if;
  return new;
end;
$$;

drop sequence if exists alumnos_codigo_seq;

-- Recalcula el código de los alumnos ya registrados con el esquema nuevo,
-- usando el año en que se registraron.
update alumnos
set codigo = to_char(created_at, 'YY') || dni;
