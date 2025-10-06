import { http, HttpResponse } from 'msw';
import {
  sucursalesMock,
  profesionalesMock,
  serviciosMock,
  bloqueosMock,
  usuariosMock,
  obtenerCitaPorId,
  obtenerCitaPorCodigo,
  crearCita,
  actualizarCita,
  eliminarCita,
  obtenerCitasPorProfesionalYFecha,
  filtrarServiciosPorEspecialidad,
  filtrarProfesionalesPorSucursalYEspecialidad,
  autenticarPaciente,
  registrarNuevoPaciente,
  obtenerPacientePorId,
  obtenerPacientePorRut
} from './mockData';
import { generarSlotsDisponibilidad } from '../lib/time';
import { generarArchivoICS } from '../lib/ics';
import type { Cita } from '../types/domain';

export const handlers = [
  // Rutas para Sucursales
  http.get('/api/sucursales', () => {
    return HttpResponse.json(sucursalesMock);
  }),

  http.get('/api/sucursales/:id', ({ params }) => {
    const sucursal = sucursalesMock.find(s => s.id === params.id);
    if (!sucursal) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(sucursal);
  }),

  // Rutas para Servicios
  http.get('/api/servicios', ({ request }) => {
    const url = new URL(request.url);
    const especialidad = url.searchParams.get('especialidad');

    let servicios = serviciosMock;

    if (especialidad) {
      servicios = filtrarServiciosPorEspecialidad(servicios, especialidad);
    }

    return HttpResponse.json(servicios);
  }),

  // Rutas para Profesionales
  http.get('/api/profesionales', ({ request }) => {
    const url = new URL(request.url);
    const especialidad = url.searchParams.get('especialidad');
    const sucursalId = url.searchParams.get('sucursalId');

    let profesionales = profesionalesMock;

    if (sucursalId || especialidad) {
      profesionales = filtrarProfesionalesPorSucursalYEspecialidad(
        profesionales,
        sucursalId,
        especialidad
      );
    }

    return HttpResponse.json(profesionales);
  }),

  http.get('/api/profesionales/:id', ({ params }) => {
    const profesional = profesionalesMock.find(p => p.id === params.id);
    if (!profesional) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(profesional);
  }),

  // Rutas para Disponibilidad
  http.get('/api/disponibilidad', ({ request }) => {
    const url = new URL(request.url);
    const profesionalId = url.searchParams.get('profesionalId');
    const fecha = url.searchParams.get('fecha');
    const servicioId = url.searchParams.get('servicioId');

    if (!profesionalId || !fecha || !servicioId) {
      return new HttpResponse(null, { status: 400 });
    }

    const profesional = profesionalesMock.find(p => p.id === profesionalId);
    const servicio = serviciosMock.find(s => s.id === servicioId);

    if (!profesional || !servicio) {
      return new HttpResponse(null, { status: 404 });
    }

    const citasExistentes = obtenerCitasPorProfesionalYFecha(profesionalId, fecha);
    const slots = generarSlotsDisponibilidad(profesional, servicio, fecha, citasExistentes, bloqueosMock);

    return HttpResponse.json(slots);
  }),

  // Rutas para Citas
  http.get('/api/citas/:id', ({ params }) => {
    const cita = obtenerCitaPorId(params.id as string);
    if (!cita) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(cita);
  }),

  http.get('/api/citas/codigo/:codigo', ({ params }) => {
    const cita = obtenerCitaPorCodigo(params.codigo as string);
    if (!cita) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(cita);
  }),

  http.post('/api/citas', async ({ request }) => {
    try {
      const data = await request.json() as Omit<Cita, 'id' | 'codigo' | 'audit'>;
      const nuevaCita = crearCita(data);
      return HttpResponse.json(nuevaCita, { status: 201 });
    } catch {
      return new HttpResponse(null, { status: 400 });
    }
  }),

  http.put('/api/citas/:id/reprogramar', async ({ params, request }) => {
    try {
      const data = await request.json() as { fecha: string; horaInicio: string };
      const citaActualizada = actualizarCita(params.id as string, data);
      if (!citaActualizada) {
        return new HttpResponse(null, { status: 404 });
      }
      return HttpResponse.json(citaActualizada);
    } catch {
      return new HttpResponse(null, { status: 400 });
    }
  }),

  http.put('/api/citas/:id/cancelar', ({ params }) => {
    const citaActualizada = actualizarCita(params.id as string, { estado: 'CANCELADA' });
    if (!citaActualizada) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(citaActualizada);
  }),

  http.put('/api/citas/:id/estado', async ({ params, request }) => {
    try {
      const data = await request.json() as { estado: string };
      const citaActualizada = actualizarCita(params.id as string, { estado: data.estado as any });
      if (!citaActualizada) {
        return new HttpResponse(null, { status: 404 });
      }
      return HttpResponse.json(citaActualizada);
    } catch {
      return new HttpResponse(null, { status: 400 });
    }
  }),

  http.delete('/api/citas/:id', ({ params }) => {
    const eliminada = eliminarCita(params.id as string);
    if (!eliminada) {
      return new HttpResponse(null, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // Rutas para Notificaciones
  http.post('/api/notificaciones/email', async ({ request }) => {
    try {
      const data = await request.json();
      console.log('📧 Email simulado enviado:', data);

      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 500));

      return HttpResponse.json({
        success: true,
        messageId: `email-${Date.now()}`
      });
    } catch {
      return new HttpResponse(null, { status: 400 });
    }
  }),

  http.post('/api/notificaciones/sms', async ({ request }) => {
    try {
      const data = await request.json();
      console.log('📱 SMS simulado enviado:', data);

      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 300));

      return HttpResponse.json({
        success: true,
        messageId: `sms-${Date.now()}`
      });
    } catch {
      return new HttpResponse(null, { status: 400 });
    }
  }),

  // Rutas para Archivos ICS (Calendario)
  http.get('/api/citas/:id/ics', ({ params }) => {
    const cita = obtenerCitaPorId(params.id as string);
    if (!cita) {
      return new HttpResponse(null, { status: 404 });
    }

    const profesional = profesionalesMock.find(p => p.id === cita.profesionalId);
    const servicio = serviciosMock.find(s => s.id === cita.servicioId);
    const sucursal = sucursalesMock.find(s => s.id === cita.sucursalId);

    const archivoICS = generarArchivoICS(cita, {
      profesional: profesional?.nombre || 'Profesional',
      servicio: servicio?.nombre || 'Consulta',
      sucursal: sucursal?.nombre || 'Clínica',
      direccion: sucursal?.direccion || '',
    });

    return new HttpResponse(archivoICS, {
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': `attachment; filename="cita-${cita.codigo}.ics"`,
      },
    });
  }),

  // Rutas para Bloqueos
  http.get('/api/bloqueos', ({ request }) => {
    const url = new URL(request.url);
    const profesionalId = url.searchParams.get('profesionalId');
    const fecha = url.searchParams.get('fecha');

    let bloqueos = bloqueosMock;

    if (profesionalId) {
      bloqueos = bloqueos.filter(b =>
        b.profesionalId === profesionalId || b.profesionalId === null
      );
    }

    if (fecha) {
      bloqueos = bloqueos.filter(b => b.fecha === fecha);
    }

    return HttpResponse.json(bloqueos);
  }),

  // Rutas de Autenticación (simuladas)
  http.post('/api/auth/login', async ({ request }) => {
    try {
      const credentials = await request.json() as { email: string; password: string };

      // Buscar usuario mock
      const usuario = usuariosMock.find(u =>
        u.email === credentials.email
      );

      if (!usuario || credentials.password !== 'admin123') {
        return new HttpResponse(null, { status: 401 });
      }

      // Simular JWT token
      const token = `mock-jwt-${usuario.id}-${Date.now()}`;

      return HttpResponse.json({
        user: usuario,
        token,
        expiresIn: 3600,
      });
    } catch {
      return new HttpResponse(null, { status: 400 });
    }
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  // Rutas para Estadísticas/Reportes
  http.get('/api/reportes/estadisticas', ({ request }) => {
    const url = new URL(request.url);
    const fechaInicio = url.searchParams.get('fechaInicio');
    const fechaFin = url.searchParams.get('fechaFin');

    // Retornar estadísticas mock basadas en el período
    const estadisticas = {
      periodo: { fechaInicio, fechaFin },
      totalCitas: 347,
      citasAtendidas: 312,
      citasCanceladas: 28,
      citasNoShow: 7,
      ingresosTotales: 15480000,
      // ... más estadísticas según se necesiten
    };

    return HttpResponse.json(estadisticas);
  }),

  // Rutas para autenticación de pacientes
  http.post('/api/pacientes/login', async ({ request }) => {
    try {
      const { rut, password } = await request.json() as { rut: string; password: string };

      if (!rut || !password) {
        return new HttpResponse(
          JSON.stringify({ error: 'RUT y contraseña son obligatorios' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Simular tiempo de autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));

      const paciente = autenticarPaciente(rut, password);

      if (!paciente) {
        return new HttpResponse(
          JSON.stringify({ error: 'RUT o contraseña incorrectos' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Generar token mock (en producción usar JWT real)
      const token = `pac-token-${paciente.id}-${Date.now()}`;

      // Respuesta exitosa
      return HttpResponse.json({
        success: true,
        message: `¡Bienvenido de vuelta, ${paciente.nombre}!`,
        data: {
          token,
          paciente: {
            id: paciente.id,
            rut: paciente.rut,
            nombre: paciente.nombre,
            email: paciente.email,
            telefono: paciente.telefono,
            prevision: paciente.prevision
          }
        }
      });

    } catch {
      return new HttpResponse(
        JSON.stringify({ error: 'Error interno del servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }),

  http.post('/api/pacientes/registro', async ({ request }) => {
    try {
      const datosRegistro = await request.json() as {
        nombre: string;
        rut: string;
        email: string;
        telefono: string;
        fechaNacimiento?: string;
        prevision: 'Fonasa' | 'Isapre' | 'Particular';
        direccion?: string;
        contactoEmergencia?: {
          nombre: string;
          telefono: string;
          relacion: string;
        };
        historialMedico?: {
          alergias?: string[];
          medicamentos?: string[];
          condicionesMedicas?: string[];
          observaciones?: string;
        };
        password: string;
      };

      // Validaciones básicas
      if (!datosRegistro.nombre || !datosRegistro.rut || !datosRegistro.email ||
          !datosRegistro.telefono || !datosRegistro.prevision || !datosRegistro.password) {
        return new HttpResponse(
          JSON.stringify({ error: 'Todos los campos obligatorios deben ser completados' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { password, ...datosPaciente } = datosRegistro;
      const nuevoPaciente = registrarNuevoPaciente(datosPaciente, password);

      return HttpResponse.json({
        success: true,
        message: 'Registro exitoso. Ya puedes iniciar sesión.',
        data: {
          paciente: {
            id: nuevoPaciente.id,
            rut: nuevoPaciente.rut,
            nombre: nuevoPaciente.nombre,
            email: nuevoPaciente.email,
            telefono: nuevoPaciente.telefono,
            prevision: nuevoPaciente.prevision
          }
        }
      });

    } catch (error) {
      if (error instanceof Error) {
        return new HttpResponse(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new HttpResponse(
        JSON.stringify({ error: 'Error interno del servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }),

  // Obtener datos del paciente autenticado
  http.get('/api/pacientes/perfil', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer pac-token-')) {
      return new HttpResponse(
        JSON.stringify({ error: 'Token de autenticación requerido' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extraer ID del paciente del token mock
    const tokenParts = authHeader.replace('Bearer ', '').split('-');
    const pacienteId = tokenParts.length >= 3 ? tokenParts.slice(2, -1).join('-') : null;

    if (!pacienteId) {
      return new HttpResponse(
        JSON.stringify({ error: 'Token inválido' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const paciente = obtenerPacientePorId(pacienteId);

    if (!paciente) {
      return new HttpResponse(
        JSON.stringify({ error: 'Paciente no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        paciente: {
          id: paciente.id,
          rut: paciente.rut,
          nombre: paciente.nombre,
          email: paciente.email,
          telefono: paciente.telefono,
          fechaNacimiento: paciente.fechaNacimiento,
          prevision: paciente.prevision,
          direccion: paciente.direccion,
          contactoEmergencia: paciente.contactoEmergencia,
          historialMedico: paciente.historialMedico,
          fechaRegistro: paciente.fechaRegistro
        }
      }
    });
  }),

  // Verificar si existe un paciente por RUT (para validaciones de registro)
  http.get('/api/pacientes/verificar/:rut', ({ params }) => {
    const rut = params.rut as string;
    const paciente = obtenerPacientePorRut(rut);

    return HttpResponse.json({
      existe: !!paciente,
      activo: paciente?.activo || false
    });
  }),

  // Logout de paciente
  http.post('/api/pacientes/logout', () => {
    // En una implementación real, aquí se invalidaría el token
    return HttpResponse.json({
      success: true,
      message: 'Sesión cerrada correctamente'
    });
  }),
];
