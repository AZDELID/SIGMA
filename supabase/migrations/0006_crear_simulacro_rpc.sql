-- Inserta un simulacro junto con sus materias (y el puntaje máximo de
-- cada una) en una sola transacción, igual que crear_alumno_con_matricula.
create or replace function crear_simulacro_con_materias(
  p_nombre text,
  p_fecha date,
  p_ciclo_id uuid,
  p_materias jsonb -- [{ "materia_id": "uuid", "puntaje_maximo": 20 }, ...]
) returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_simulacro_id uuid;
  v_item jsonb;
begin
  insert into simulacros (nombre, fecha, ciclo_id)
  values (p_nombre, p_fecha, p_ciclo_id)
  returning id into v_simulacro_id;

  for v_item in select * from jsonb_array_elements(p_materias)
  loop
    insert into simulacro_materias (simulacro_id, materia_id, puntaje_maximo)
    values (
      v_simulacro_id,
      (v_item ->> 'materia_id')::uuid,
      (v_item ->> 'puntaje_maximo')::numeric
    );
  end loop;

  return v_simulacro_id;
end;
$$;

grant execute on function crear_simulacro_con_materias to authenticated;
