"use client";

import { useActionState, useMemo, useState } from "react";
import { crearAlumno, type AlumnoFormState } from "../actions";
import { FotoCaptura } from "../foto-captura";
import { claseCampo, MensajeCampo } from "../campo-error";
import type { Area, Carrera, Ciclo } from "@/lib/types/database";

const initialState: AlumnoFormState = { error: null };

export function AlumnoForm({
  ciclos,
  areas,
  carreras,
}: {
  ciclos: Ciclo[];
  areas: Area[];
  carreras: Carrera[];
}) {
  const [state, formAction, pending] = useActionState(
    crearAlumno,
    initialState
  );
  const [cicloId, setCicloId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [carreraId, setCarreraId] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  const cicloSeleccionado = useMemo(
    () => ciclos.find((c) => c.id === cicloId),
    [ciclos, cicloId]
  );

  const carrerasDelArea = useMemo(
    () => carreras.filter((c) => c.area_id === areaId),
    [carreras, areaId]
  );

  return (
    <form action={formAction} className="space-y-6">
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
            defaultValue={state.valores?.nombres}
            className={claseCampo("nombres", state.campo)}
          />
          <MensajeCampo campo="nombres" campoConError={state.campo} mensaje={state.error} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Apellidos *
          </label>
          <input
            name="apellidos"
            required
            defaultValue={state.valores?.apellidos}
            className={claseCampo("apellidos", state.campo)}
          />
          <MensajeCampo campo="apellidos" campoConError={state.campo} mensaje={state.error} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            DNI * (8 dígitos — es la base del código del alumno)
          </label>
          <input
            name="dni"
            required
            pattern="\d{8}"
            title="8 dígitos"
            inputMode="numeric"
            maxLength={8}
            defaultValue={state.valores?.dni}
            className={claseCampo("dni", state.campo)}
          />
          <MensajeCampo campo="dni" campoConError={state.campo} mensaje={state.error} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Fecha de nacimiento
          </label>
          <input
            name="fecha_nacimiento"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            defaultValue={state.valores?.fecha_nacimiento}
            className={claseCampo("fecha_nacimiento", state.campo)}
          />
          <MensajeCampo
            campo="fecha_nacimiento"
            campoConError={state.campo}
            mensaje={state.error}
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
            defaultValue={state.valores?.telefono}
            className={claseCampo("telefono", state.campo)}
          />
          <MensajeCampo campo="telefono" campoConError={state.campo} mensaje={state.error} />
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
            defaultValue={state.valores?.telefono_apoderado}
            className={claseCampo("telefono_apoderado", state.campo)}
          />
          <MensajeCampo
            campo="telefono_apoderado"
            campoConError={state.campo}
            mensaje={state.error}
          />
          <label className="mt-1.5 flex items-center gap-1.5 text-xs text-brand-700">
            <input
              type="checkbox"
              name="tiene_whatsapp"
              defaultChecked={state.valores?.tiene_whatsapp ?? false}
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
            defaultValue={state.valores?.direccion}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
          />
        </div>
        <div className="sm:col-span-2">
          <FotoCaptura onFotoLista={setFotoUrl} />
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
            defaultValue={state.valores?.turno ?? ""}
            className={claseCampo("turno", state.campo)}
          >
            <option value="" disabled>
              Selecciona
            </option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
          </select>
          <MensajeCampo campo="turno" campoConError={state.campo} mensaje={state.error} />
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
            className={`${claseCampo("carrera_id", state.campo)} disabled:bg-brand-50`}
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
          <MensajeCampo campo="carrera_id" campoConError={state.campo} mensaje={state.error} />
        </div>
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-3 rounded-lg border border-brand-200 bg-brand-surface p-4 sm:grid-cols-3">
        <legend className="px-1 text-sm font-medium text-brand-700">
          Matrícula
        </legend>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Ciclo *
          </label>
          <select
            name="ciclo_id"
            required
            value={cicloId}
            onChange={(e) => setCicloId(e.target.value)}
            className={claseCampo("ciclo_id", state.campo)}
          >
            <option value="">Selecciona un ciclo</option>
            {ciclos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          <MensajeCampo campo="ciclo_id" campoConError={state.campo} mensaje={state.error} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Monto pactado (S/) *
          </label>
          <input
            name="monto_pactado"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={
              state.valores?.monto_pactado ?? cicloSeleccionado?.monto_default ?? ""
            }
            key={cicloSeleccionado?.id ?? "sin-ciclo"}
            className={claseCampo("monto_pactado", state.campo)}
          />
          <MensajeCampo
            campo="monto_pactado"
            campoConError={state.campo}
            mensaje={state.error}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-600">
            Fecha de matrícula
          </label>
          <input
            name="fecha_matricula"
            type="date"
            defaultValue={
              state.valores?.fecha_matricula ?? new Date().toISOString().slice(0, 10)
            }
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
          />
        </div>
      </fieldset>

      {state.error && !state.campo && (
        <p className="text-sm text-brand-red-dark">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:bg-brand-800 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Matricular alumno"}
      </button>
    </form>
  );
}
