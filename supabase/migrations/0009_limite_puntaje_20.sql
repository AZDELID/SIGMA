-- El puntaje máximo de una materia en un simulacro nunca puede pasar de 20
-- (escala vigesimal estándar). Y el puntaje que se le carga a un alumno
-- nunca puede pasar el máximo configurado para esa materia.

alter table simulacro_materias
  add constraint simulacro_materias_puntaje_maximo_limite
    check (puntaje_maximo > 0 and puntaje_maximo <= 20);

create or replace function validar_puntaje_obtenido()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_maximo numeric;
begin
  select puntaje_maximo into v_maximo
  from simulacro_materias
  where id = new.simulacro_materia_id;

  if new.puntaje_obtenido > v_maximo then
    raise exception
      'El puntaje (%) no puede superar el máximo de la materia (%).',
      new.puntaje_obtenido, v_maximo;
  end if;

  return new;
end;
$$;

create trigger trg_validar_puntaje_obtenido
before insert or update on resultados
for each row execute function validar_puntaje_obtenido();
