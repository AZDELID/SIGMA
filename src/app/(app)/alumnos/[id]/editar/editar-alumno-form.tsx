"use client";

import { useMemo, useState, useActionState } from "react";
import { actualizarAlumno, type EditarAlumnoState } from "../../actions";
import { FotoCaptura } from "../../foto-captura";
import type { Alumno, Area, Carrera } from "@/lib/types/database";

const initialState: EditarAlumnoState = { error: null };

export function EditarAlumnoForm({
  alumno,
  areas,
  carreras,
}: {
  alumno: Alumno;
  areas: Area[];
  carreras: Carrera[];
}) {
  const action = actualizarAlumno.bind(null, alumno.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  const carreraActual = carreras.find((c) => c.id === alumno.carrera_id);
  const [areaId, setAreaId] = useState(carreraActual?.area_id ?? "");
  const [carreraId, setCarreraId] = useState(alumno.carrera_id ?? "");
  const [fotoUrl, setFotoUrl] = useState(alumno.foto_url ?? "");

  const carrerasDelArea = useMemo(
    () => carreras.filter((c) => c.area_id === areaId),
    [carreras, areaId]
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="foto_url" value={fotoUrl} />

      <fieldset className="grid grid-cols-1 gap-3 rounded-lg border border-brand-200 bg-brand-surface p-4 sm:grid-cols-2">
        <legend className="px-1 text-sm font-medium text-brand-700">
          Datos del alumno
        </legend>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Nombres *
          </label>
          <input
            name="nombres"
            required
            defaultValue={alumno.nombres}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Apellidos *
          </label>
          <input
            name="apellidos"
            required
            defaultValue={alumno.apellidos}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            DNI * (8 dígitos)
          </label>
          <input
            name="dni"
            required
            pattern="\d{8}"
            title="8 dígitos"
            inputMode="numeric"
            maxLength={8}
            defaultValue={alumno.dni}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
          />
          <p className="mt-1 text-xs text-brand-yellow-dark">
            Si lo cambias, el código del alumno (código {alumno.codigo}) se
            regenera y el carnet/QR ya impreso deja de coincidir.
          </p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Fecha de nacimiento
          </label>
          <input
            name="fecha_nacimiento"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            defaultValue={alumno.fecha_nacimiento ?? ""}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Teléfono del alumno (9 dígitos)
          </label>
          <input
            name="telefono"
            pattern="\d{9}"
            title="9 dígitos"
            inputMode="numeric"
            maxLength={9}
            defaultValue={alumno.telefono ?? ""}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Teléfono del apoderado (9 dígitos)
          </label>
          <input
            name="telefono_apoderado"
            pattern="\d{9}"
            title="9 dígitos"
            inputMode="numeric"
            maxLength={9}
            defaultValue={alumno.telefono_apoderado ?? ""}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
          />
          <label className="mt-1.5 flex items-center gap-1.5 text-xs text-brand-700">
            <input
              type="checkbox"
              name="tiene_whatsapp"
              defaultChecked={alumno.tiene_whatsapp}
            />
            Tiene WhatsApp
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Dirección
          </label>
          <input
            name="direccion"
            defaultValue={alumno.direccion ?? ""}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
          />
        </div>
        <div className="sm:col-span-2">
          <FotoCaptura fotoActualUrl={alumno.foto_url} onFotoLista={setFotoUrl} />
        </div>
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-3 rounded-lg border border-brand-200 bg-brand-surface p-4 sm:grid-cols-3">
        <legend className="px-1 text-sm font-medium text-brand-700">
          Postulación
        </legend>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Turno *
          </label>
          <select
            name="turno"
            required
            defaultValue={alumno.turno ?? ""}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
          >
            <option value="" disabled>
              Selecciona
            </option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Área *
          </label>
          <select
            required
            value={areaId}
            onChange={(e) => {
              setAreaId(e.target.value);
              setCarreraId("");
            }}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
          >
            <option value="">Selecciona un área</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Carrera *
          </label>
          <select
            name="carrera_id"
            required
            value={carreraId}
            onChange={(e) => setCarreraId(e.target.value)}
            disabled={!areaId}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field disabled:bg-brand-50"
          >
            <option value="">
              {areaId ? "Selecciona una carrera" : "Elige un área primero"}
            </option>
            {carrerasDelArea.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      {state.error && <p className="text-sm text-brand-red-dark">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
