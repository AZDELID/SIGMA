-- Las asistencias ahora distinguen entrada / salida / permiso, no solo un
-- marcado genérico. Por defecto 'entrada' para no romper filas existentes.
alter table asistencias
  add column tipo text not null default 'entrada'
    check (tipo in ('entrada', 'salida', 'permiso'));

create index asistencias_tipo_idx on asistencias (tipo);
