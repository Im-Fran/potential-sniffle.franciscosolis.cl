import type { Cita } from '../types/domain';
import { formatearFechaChile } from './time';

interface DatosCitaICS {
  profesional: string;
  servicio: string;
  sucursal: string;
  direccion: string;
}

/**
 * Genera un archivo ICS (iCalendar) para una cita
 */
export function generarArchivoICS(cita: Cita, datos: DatosCitaICS): string {
  const ahora = new Date();
  const fechaCreacion = ahora.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  // Convertir fecha y hora de la cita a formato UTC
  const fechaCita = new Date(`${cita.fecha}T${cita.horaInicio}:00-03:00`); // Chile es UTC-3
  const fechaInicio = fechaCita.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const fechaFin = new Date(`${cita.fecha}T${cita.horaFin}:00-03:00`);
  const fechaFinFormatted = fechaFin.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  // Generar UID único
  const uid = `${cita.codigo}@clinica-dental.com`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Clínica Dental//Sistema de Citas//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${fechaCreacion}`,
    `DTSTART:${fechaInicio}`,
    `DTEND:${fechaFinFormatted}`,
    `SUMMARY:Cita Dental - ${datos.servicio}`,
    `DESCRIPTION:Cita dental programada\\n\\nServicio: ${datos.servicio}\\nProfesional: ${datos.profesional}\\nPaciente: ${cita.paciente.nombre}\\nCódigo: ${cita.codigo}\\n\\nRecuerde llegar 10 minutos antes de su cita.`,
    `LOCATION:${datos.sucursal}\\n${datos.direccion}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Recordatorio de cita dental',
    'TRIGGER:-PT1H', // Alarma 1 hora antes
    'END:VALARM',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Recordatorio de cita dental - 30 minutos',
    'TRIGGER:-PT30M', // Alarma 30 minutos antes
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
}

/**
 * Descarga un archivo ICS
 */
export function descargarArchivoICS(contenido: string, nombreArchivo: string): void {
  const blob = new Blob([contenido], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}

/**
 * Genera un enlace de Google Calendar
 */
export function generarEnlaceGoogleCalendar(cita: Cita, datos: DatosCitaICS): string {
  const fechaInicio = new Date(`${cita.fecha}T${cita.horaInicio}:00`);
  const fechaFin = new Date(`${cita.fecha}T${cita.horaFin}:00`);

  const formatoGoogle = (fecha: Date) => {
    return fecha.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Cita Dental - ${datos.servicio}`,
    dates: `${formatoGoogle(fechaInicio)}/${formatoGoogle(fechaFin)}`,
    details: `Cita dental programada\n\nServicio: ${datos.servicio}\nProfesional: ${datos.profesional}\nPaciente: ${cita.paciente.nombre}\nCódigo: ${cita.codigo}\n\nRecuerde llegar 10 minutos antes de su cita.`,
    location: `${datos.sucursal}, ${datos.direccion}`,
    trp: 'false'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Genera un enlace de Outlook Calendar
 */
export function generarEnlaceOutlookCalendar(cita: Cita, datos: DatosCitaICS): string {
  const fechaInicio = new Date(`${cita.fecha}T${cita.horaInicio}:00`);
  const fechaFin = new Date(`${cita.fecha}T${cita.horaFin}:00`);

  const params = new URLSearchParams({
    subject: `Cita Dental - ${datos.servicio}`,
    startdt: fechaInicio.toISOString(),
    enddt: fechaFin.toISOString(),
    body: `Cita dental programada\n\nServicio: ${datos.servicio}\nProfesional: ${datos.profesional}\nPaciente: ${cita.paciente.nombre}\nCódigo: ${cita.codigo}\n\nRecuerde llegar 10 minutos antes de su cita.`,
    location: `${datos.sucursal}, ${datos.direccion}`,
    path: '/calendar/action/compose'
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
