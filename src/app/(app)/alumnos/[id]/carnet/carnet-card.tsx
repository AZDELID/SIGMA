import Image from "next/image";
import {
  IconoPersona,
  IconoEngranaje,
  IconoReloj,
  IconoCalendario,
  IconoBirrete,
  IconoLibro,
} from "./iconos";

export type DatosCarnet = {
  nombreCompleto: string;
  codigo: string;
  areaNumero: number | null;
  turno: string | null;
  fotoUrl: string | null;
  qrDataUrl: string;
};

const TAGLINE = "Disciplina, perseverancia y humildad";

function InfoRow({
  Icono,
  label,
  value,
  alto,
}: {
  Icono: (p: { className?: string }) => React.JSX.Element;
  label: string;
  value: string;
  alto: string;
}) {
  return (
    <div className={`flex items-center gap-1 overflow-hidden ${alto}`}>
      <div className="flex h-full aspect-square shrink-0 items-center justify-center rounded-[3px] bg-brand-900">
        <Icono className="h-[55%] w-[55%] text-white" />
      </div>
      <div className="min-w-0 flex-1 leading-none">
        <p className="truncate text-[5.5px] font-medium leading-none tracking-wide text-brand-600">
          {label}
        </p>
        <p className="mt-[1px] truncate text-[8px] font-bold leading-none text-brand-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function Foto({ fotoUrl, className }: { fotoUrl: string | null; className: string }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border-2 border-brand-900 bg-brand-50 ${className}`}
    >
      {fotoUrl && (
        <Image
          src={fotoUrl}
          alt="Foto del alumno"
          fill
          unoptimized
          className="object-cover"
        />
      )}
    </div>
  );
}

function Qr({ qrDataUrl, className }: { qrDataUrl: string; className: string }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-md border border-brand-300 p-[3px] ${className}`}
    >
      <Image src={qrDataUrl} alt="Código QR" fill unoptimized className="object-contain" />
      <div className="absolute inset-0 m-auto h-[22%] w-[22%]">
        <Image
          src="/logo.png"
          alt=""
          fill
          className="rounded-sm bg-white object-contain p-[1px]"
        />
      </div>
    </div>
  );
}

function Encabezado({
  logoTam,
  tituloTam,
}: {
  logoTam: string;
  tituloTam: string;
}) {
  return (
    <div className="flex h-full items-center gap-1.5 overflow-hidden px-2.5">
      <Image
        src="/logo.png"
        alt="SIGMA"
        width={50}
        height={50}
        className={`shrink-0 object-contain ${logoTam}`}
      />
      <div className="min-w-0 flex-1 leading-none">
        <p className="truncate text-[5.5px] leading-none text-brand-700">
          Academia Pre Universitaria
        </p>
        <p className={`truncate font-extrabold leading-none text-brand-900 ${tituloTam}`}>
          SIGMA
        </p>
        <p className="truncate text-[5px] leading-none text-brand-600">{TAGLINE}</p>
      </div>
    </div>
  );
}

function BarraInferior({ dosLineas }: { dosLineas?: boolean }) {
  return (
    <div className="flex h-full items-center justify-center gap-1 overflow-hidden bg-brand-red px-2">
      <IconoCalendario className="h-[8px] w-[8px] shrink-0 text-white" />
      <p className="text-center text-[5.5px] font-semibold leading-none tracking-wide text-white">
        {dosLineas ? (
          <>
            SISTEMA DE CONTROL
            <br />
            DE ASISTENCIA
          </>
        ) : (
          "SISTEMA DE CONTROL DE ASISTENCIA"
        )}
      </p>
    </div>
  );
}

export function CarnetHorizontal({ datos }: { datos: DatosCarnet }) {
  const { nombreCompleto, codigo, areaNumero, turno, fotoUrl, qrDataUrl } = datos;

  return (
    <div
      className="grid w-[8.5cm] h-[5.4cm] grid-cols-1 overflow-hidden rounded-2xl border-2 border-brand-900 bg-white shadow-sm"
      style={{ gridTemplateRows: "1.1cm 2.9cm 0.6cm 0.8cm" }}
    >
      <Encabezado logoTam="h-[0.9cm] w-[0.9cm]" tituloTam="text-[15px]" />

      <div className="flex items-center justify-between gap-2.5 overflow-hidden px-2.5">
        <Foto fotoUrl={fotoUrl} className="h-[2.5cm] w-[2.5cm]" />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-[0.08cm]">
          <InfoRow Icono={IconoPersona} label="CÓDIGO" value={codigo} alto="h-[0.5cm]" />
          <InfoRow
            Icono={IconoEngranaje}
            label="ÁREA"
            value={areaNumero ? `Área ${areaNumero}` : "—"}
            alto="h-[0.5cm]"
          />
          <InfoRow
            Icono={IconoReloj}
            label="TURNO"
            value={turno ?? "—"}
            alto="h-[0.5cm]"
          />
        </div>
        <Qr qrDataUrl={qrDataUrl} className="h-[2.5cm] w-[2.5cm]" />
      </div>

      <div className="flex items-center justify-between gap-2 overflow-hidden px-2.5">
        <p className="min-w-0 truncate text-[10px] font-bold leading-none text-brand-900">
          {nombreCompleto}
        </p>
        <div className="flex shrink-0 items-center gap-1 text-brand-900">
          <IconoBirrete className="h-[8px] w-[8px]" />
          <IconoEngranaje className="h-[8px] w-[8px]" />
          <IconoLibro className="h-[8px] w-[8px]" />
        </div>
      </div>

      <BarraInferior />
    </div>
  );
}

export function CarnetVertical({ datos }: { datos: DatosCarnet }) {
  const { nombreCompleto, codigo, areaNumero, turno, fotoUrl, qrDataUrl } = datos;

  return (
    <div
      className="relative grid w-[5.4cm] h-[8.5cm] grid-cols-1 overflow-hidden rounded-2xl border-2 border-brand-900 bg-white shadow-sm"
      style={{ gridTemplateRows: "1.1cm 2.2cm 0.5cm 3.7cm 1.0cm" }}
    >
      <div className="pointer-events-none absolute -left-5 -top-5 z-0 h-14 w-14 rotate-45 bg-brand-200" />

      <div className="relative z-10">
        <Encabezado logoTam="h-[0.8cm] w-[0.8cm]" tituloTam="text-[13px]" />
      </div>

      <div className="relative z-10 flex items-center justify-center overflow-hidden">
        <Foto fotoUrl={fotoUrl} className="h-[2cm] w-[2cm]" />
      </div>

      <div className="relative z-10 flex items-center justify-center overflow-hidden px-2">
        <p className="truncate text-center text-[10px] font-bold leading-none text-brand-900">
          {nombreCompleto}
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-1 overflow-hidden px-2">
        <p
          className="h-full shrink-0 overflow-hidden text-[5px] font-semibold leading-none tracking-wide text-brand-red"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          ACADEMIA SIGMA
        </p>
        <div className="flex shrink-0 flex-col items-center justify-center gap-[0.15cm] text-brand-900">
          <IconoBirrete className="h-[0.28cm] w-[0.28cm]" />
          <IconoEngranaje className="h-[0.28cm] w-[0.28cm]" />
          <IconoLibro className="h-[0.28cm] w-[0.28cm]" />
        </div>
        <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-[0.08cm]">
          <div className="w-full space-y-[0.06cm]">
            <InfoRow Icono={IconoPersona} label="CÓDIGO" value={codigo} alto="h-[0.42cm]" />
            <InfoRow
              Icono={IconoEngranaje}
              label="ÁREA"
              value={areaNumero ? `Área ${areaNumero}` : "—"}
              alto="h-[0.42cm]"
            />
            <InfoRow
              Icono={IconoReloj}
              label="TURNO"
              value={turno ?? "—"}
              alto="h-[0.42cm]"
            />
          </div>
          <Qr qrDataUrl={qrDataUrl} className="h-[2cm] w-[2cm]" />
        </div>
      </div>

      <div className="relative z-10">
        <BarraInferior dosLineas />
      </div>
    </div>
  );
}
