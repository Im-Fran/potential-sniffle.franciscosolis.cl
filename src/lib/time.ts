import { format, parse, addMinutes, isBefore, isEqual } from 'date-fns';
import { fromZonedTime, toZonedTime, formatInTimeZone } from 'date-fns-tz';
import type { DisponibilidadSlot, TurnoSemanal, Bloqueo, Servicio } from '../types/domain';

const CHILE_TZ = 'America/Santiago';

/**
 * Convierte una fecha y hora en Chile a UTC
 */
export function chileToUtc(fecha: string, hora: string): Date {
  const fechaHora = `${fecha} ${hora}`;
  const fechaLocal = parse(fechaHora, 'yyyy-MM-dd HH:mm', new Date());
  return fromZonedTime(fechaLocal, CHILE_TZ);
}

/**
 * Convierte UTC a fecha/hora de Chile
 */
export function utcToChile(date: Date): { fecha: string; hora: string } {
  const fechaChile = toZonedTime(date, CHILE_TZ);
  return {
    fecha: format(fechaChile, 'yyyy-MM-dd'),
    hora: format(fechaChile, 'HH:mm')
  };
}

/**
 * Formatea fecha para mostrar al usuario (DD/MM/YYYY)
 */
export function formatearFechaChile(fecha: string): string {
  const date = parse(fecha, 'yyyy-MM-dd', new Date());
  return format(date, 'dd/MM/yyyy');
}

/**
 * Obtiene la fecha actual en Chile
 */
export function obtenerFechaHoyChile(): string {
  return formatInTimeZone(new Date(), CHILE_TZ, 'yyyy-MM-dd');
}

/**
 * Obtiene la hora actual en Chile
 */
export function obtenerHoraActualChile(): string {
  return formatInTimeZone(new Date(), CHILE_TZ, 'HH:mm');
}

/**
 * Convierte día de la semana de JS (0=domingo) a formato de dominio (1=lunes)
 */
export function convertirDiaSemana(jsDay: number): number {
  return jsDay === 0 ? 7 : jsDay;
}

/**
 * Convierte día de dominio (1=lunes) a JS (0=domingo)
 */
export function convertirDiaSemanaBrowser(domainDay: number): number {
  return domainDay === 7 ? 0 : domainDay;
}

/**
 * Verifica si una cita puede ser modificada (24 horas de anticipación)
 */
export function puedeModificarCita(fechaCita: string, horaCita: string): boolean {
  const ahora = new Date();
  const fechaHoraCita = chileToUtc(fechaCita, horaCita);
  const horasDeAnticipacion = (fechaHoraCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);

  return horasDeAnticipacion >= 24;
}

/**
 * Genera slots de disponibilidad para un profesional en una fecha específica
 */
export function generarSlotsDisponibilidad(
  profesional: any,
  servicio: Servicio,
  fecha: string,
  citasExistentes: any[],
  bloqueos: Bloqueo[]
): DisponibilidadSlot[] {
  const slots: DisponibilidadSlot[] = [];
  const fechaDate = parse(fecha, 'yyyy-MM-dd', new Date());
  const diaSemana = convertirDiaSemana(fechaDate.getDay());

  // Encontrar turno del profesional para este día
  const turnoDelDia = profesional.turnos?.find((turno: TurnoSemanal) =>
    turno.diaSemana === diaSemana
  );

  if (!turnoDelDia) {
    return slots; // No trabaja este día
  }

  // Generar slots cada 15 minutos dentro del turno
  const horaInicio = parse(turnoDelDia.desde, 'HH:mm', new Date());
  const horaFin = parse(turnoDelDia.hasta, 'HH:mm', new Date());

  let horaActual = horaInicio;

  while (isBefore(horaActual, horaFin)) {
    const horaInicioSlot = format(horaActual, 'HH:mm');
    const horaFinSlot = format(addMinutes(horaActual, servicio.duracionMinutos), 'HH:mm');

    // Verificar si hay conflictos
    const hayConflicto = verificarConflictos(
      fecha,
      horaInicioSlot,
      horaFinSlot,
      citasExistentes,
      bloqueos
    );

    slots.push({
      horaInicio: horaInicioSlot,
      horaFin: horaFinSlot,
      disponible: !hayConflicto.tieneConflicto,
      motivoNoDisponible: hayConflicto.motivo,
    });

    horaActual = addMinutes(horaActual, 15); // Intervalos de 15 minutos
  }

  return slots;
}

/**
 * Verifica conflictos de horarios
 */
function verificarConflictos(
  fecha: string,
  horaInicio: string,
  horaFin: string,
  citasExistentes: any[],
  bloqueos: Bloqueo[]
): { tieneConflicto: boolean; motivo?: string } {

  // Verificar citas existentes
  for (const cita of citasExistentes) {
    if (cita.fecha === fecha) {
      const citaInicio = parse(cita.horaInicio, 'HH:mm', new Date());
      const citaFin = parse(cita.horaFin, 'HH:mm', new Date());
      const slotInicio = parse(horaInicio, 'HH:mm', new Date());
      const slotFin = parse(horaFin, 'HH:mm', new Date());

      // Verificar solapamiento
      if (
        (isBefore(slotInicio, citaFin) && isBefore(citaInicio, slotFin)) ||
        isEqual(slotInicio, citaInicio)
      ) {
        return { tieneConflicto: true, motivo: 'OCUPADO' };
      }
    }
  }

  // Verificar bloqueos
  for (const bloqueo of bloqueos) {
    if (bloqueo.fecha === fecha) {
      const bloqueoInicio = parse(bloqueo.desde, 'HH:mm', new Date());
      const bloqueoFin = parse(bloqueo.hasta, 'HH:mm', new Date());
      const slotInicio = parse(horaInicio, 'HH:mm', new Date());
      const slotFin = parse(horaFin, 'HH:mm', new Date());

      // Verificar solapamiento
      if (
        (isBefore(slotInicio, bloqueoFin) && isBefore(bloqueoInicio, slotFin)) ||
        isEqual(slotInicio, bloqueoInicio)
      ) {
        return { tieneConflicto: true, motivo: 'BLOQUEO' };
      }
    }
  }

  return { tieneConflicto: false };
}

/**
 * Calcula el tiempo de duración total incluyendo buffers
 */
export function calcularDuracionConBuffers(servicio: Servicio): number {
  return (servicio.bufferPrevioMin || 0) +
         servicio.duracionMinutos +
         (servicio.bufferPosteriorMin || 0);
}

/**
 * Formatea duración en minutos a texto legible
 */
export function formatearDuracion(minutos: number): string {
  if (minutos < 60) {
    return `${minutos} min`;
  }

  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  if (minutosRestantes === 0) {
    return `${horas}h`;
  }

  return `${horas}h ${minutosRestantes}min`;
}

/**
 * Verifica si una fecha es día laborable
 */
export function esDiaLaborable(fecha: string): boolean {
  const fechaDate = parse(fecha, 'yyyy-MM-dd', new Date());
  const diaSemana = fechaDate.getDay();
  return diaSemana >= 1 && diaSemana <= 6; // Lunes a Sábado
}

/**
 * Obtiene el rango de fechas para un mes específico
 */
export function obtenerRangoMes(fecha: string): { inicio: string; fin: string } {
  const fechaDate = parse(fecha, 'yyyy-MM-dd', new Date());
  const primerDia = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), 1);
  const ultimoDia = new Date(fechaDate.getFullYear(), fechaDate.getMonth() + 1, 0);

  return {
    inicio: format(primerDia, 'yyyy-MM-dd'),
    fin: format(ultimoDia, 'yyyy-MM-dd'),
  };
}

/**
 * Convierte fecha y hora a timestamp para ordenamiento
 */
export function fechaHoraATimestamp(fecha: string, hora: string): number {
  return chileToUtc(fecha, hora).getTime();
}

/**
 * Verifica si una fecha está en el futuro
 */
export function esFechaFutura(fecha: string): boolean {
  const fechaDate = parse(fecha, 'yyyy-MM-dd', new Date());
  const hoy = parse(obtenerFechaHoyChile(), 'yyyy-MM-dd', new Date());
  return fechaDate > hoy;
}

/**
 * Obtiene los próximos N días laborables
 */
export function obtenerProximosDiasLaborables(cantidad: number): string[] {
  const dias: string[] = [];
  let fechaActual = parse(obtenerFechaHoyChile(), 'yyyy-MM-dd', new Date());

  while (dias.length < cantidad) {
    const fechaStr = format(fechaActual, 'yyyy-MM-dd');
    if (esDiaLaborable(fechaStr)) {
      dias.push(fechaStr);
    }
    fechaActual = addMinutes(fechaActual, 24 * 60); // Agregar un día
  }

  return dias;
}
