-- Fija el search_path de las funciones para que no dependa del rol que las llama
-- (recomendación del linter de seguridad de Supabase).

alter function public.set_alumno_codigo() set search_path = public, pg_temp;

alter function public.crear_alumno_con_matricula(
  text, text, text, date, text, text, text, uuid, numeric, date
) set search_path = public, pg_temp;
