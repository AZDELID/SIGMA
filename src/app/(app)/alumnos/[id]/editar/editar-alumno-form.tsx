"use client";

import { useMemo, useState, useActionState } from "react";
import { actualizarAlumno, type EditarAlumnoState } from "../../actions";
import { FotoCaptura } from "../../foto-captura";
import { claseCampo, MensajeCampo } from "../../campo-error";
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
<<<<<<< HEAD
            defaultValue={alumno.nombres}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
=======
            defaultValue={state.valores?.nombres ?? alumno.nombres}
            className={claseCampo("nombres", state.campo)}
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
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
<<<<<<< HEAD
            defaultValue={alumno.apellidos}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
=======
            defaultValue={state.valores?.apellidos ?? alumno.apellidos}
            className={claseCampo("apellidos", state.campo)}
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
          />
          <MensajeCampo campo="apellidos" campoConError={state.campo} mensaje={state.error} />
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
<<<<<<< HEAD
            defaultValue={alumno.dni}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
=======
            defaultValue={state.valores?.dni ?? alumno.dni}
            className={claseCampo("dni", state.campo)}
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
          />
          <MensajeCampo campo="dni" campoConError={state.campo} mensaje={state.error} />
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
<<<<<<< HEAD
            defaultValue={alumno.fecha_nacimiento ?? ""}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
=======
            defaultValue={state.valores?.fecha_nacimiento ?? alumno.fecha_nacimiento ?? ""}
            className={claseCampo("fecha_nacimiento", state.campo)}
          />
          <MensajeCampo
            campo="fecha_nacimiento"
            campoConError={state.campo}
            mensaje={state.error}
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
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
<<<<<<< HEAD
            defaultValue={alumno.telefono ?? ""}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
=======
            defaultValue={state.valores?.telefono ?? alumno.telefono ?? ""}
            className={claseCampo("telefono", state.campo)}
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
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
<<<<<<< HEAD
            defaultValue={alumno.telefono_apoderado ?? ""}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
=======
            defaultValue={state.valores?.telefono_apoderado ?? alumno.telefono_apoderado ?? ""}
            className={claseCampo("telefono_apoderado", state.campo)}
          />
          <MensajeCampo
            campo="telefono_apoderado"
            campoConError={state.campo}
            mensaje={state.error}
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
          />
          <label className="mt-1.5 flex items-center gap-1.5 text-xs text-brand-700">
            <input
              type="checkbox"
              name="tiene_whatsapp"
              defaultChecked={state.valores?.tiene_whatsapp ?? alumno.tiene_whatsapp}
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
<<<<<<< HEAD
            defaultValue={alumno.direccion ?? ""}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
=======
            defaultValue={state.valores?.direccion ?? alumno.direccion ?? ""}
            className="w-full rounded-md border border-brand-300 bg-white px-3 py-2 text-sm text-black"
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
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
<<<<<<< HEAD
            defaultValue={alumno.turno ?? ""}
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field"
=======
            defaultValue={state.valores?.turno ?? alumno.turno ?? ""}
            className={claseCampo("turno", state.campo)}
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
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
<<<<<<< HEAD
            className="w-full rounded-md border border-brand-300 bg-brand-surface px-3 py-2 text-sm text-brand-field disabled:bg-brand-50"
=======
            className={`${claseCampo("carrera_id", state.campo)} disabled:bg-brand-50`}
>>>>>>> a40aa8d8044f1cbdfc09716e5f67653bd8770067
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

      {state.error && !state.campo && (
        <p className="text-sm text-brand-red-dark">{state.error}</p>
      )}

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
