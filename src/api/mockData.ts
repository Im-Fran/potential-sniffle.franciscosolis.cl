import type { Sucursal, Profesional, Servicio, Cita, Bloqueo, Usuario, PacienteRegistrado } from '../types/domain';

// Datos mock de sucursales
export const sucursalesMock: Sucursal[] = [
  {
    id: 'suc-1',
    nombre: 'Providencia',
    direccion: 'Av. Providencia 1234, Providencia, Santiago',
    telefono: '+56 2 2234 5678',
    horarioAtencion: {
      lunes: { abre: '08:00', cierra: '19:00' },
      martes: { abre: '08:00', cierra: '19:00' },
      miercoles: { abre: '08:00', cierra: '19:00' },
      jueves: { abre: '08:00', cierra: '19:00' },
      viernes: { abre: '08:00', cierra: '19:00' },
      sabado: { abre: '09:00', cierra: '14:00' },
      domingo: null,
    },
  },
  {
    id: 'suc-2',
    nombre: 'Maipú',
    direccion: 'Av. Américo Vespucio 456, Maipú, Santiago',
    telefono: '+56 2 2876 5432',
    horarioAtencion: {
      lunes: { abre: '08:30', cierra: '18:30' },
      martes: { abre: '08:30', cierra: '18:30' },
      miercoles: { abre: '08:30', cierra: '18:30' },
      jueves: { abre: '08:30', cierra: '18:30' },
      viernes: { abre: '08:30', cierra: '18:30' },
      sabado: { abre: '09:00', cierra: '13:00' },
      domingo: null,
    },
  },
];

// Datos mock de servicios
export const serviciosMock: Servicio[] = [
  {
    id: 'serv-1',
    nombre: 'Control',
    especialidad: 'Odontología General',
    duracionMinutos: 15,
  },
  {
    id: 'serv-2',
    nombre: 'Limpieza/Profilaxis',
    especialidad: 'Odontología General',
    duracionMinutos: 30,
    bufferPosteriorMin: 5,
  },
  {
    id: 'serv-3',
    nombre: 'Endodoncia',
    especialidad: 'Endodoncia',
    duracionMinutos: 60,
    bufferPrevioMin: 10,
    bufferPosteriorMin: 15,
  },
  {
    id: 'serv-4',
    nombre: 'Urgencia',
    especialidad: 'Odontología General',
    duracionMinutos: 30,
    bufferPosteriorMin: 5,
  },
  {
    id: 'serv-5',
    nombre: 'Extracción',
    especialidad: 'Cirugía Oral',
    duracionMinutos: 45,
    bufferPrevioMin: 15,
    bufferPosteriorMin: 30,
  },
  {
    id: 'serv-6',
    nombre: 'Ortodoncia - Control',
    especialidad: 'Ortodoncia',
    duracionMinutos: 20,
    bufferPosteriorMin: 5,
  },
];

// Datos mock de profesionales
export const profesionalesMock: Profesional[] = [
  {
    id: 'prof-1',
    nombre: 'Dra. Ana Pérez',
    especialidades: ['Odontología General', 'Endodoncia'],
    sucursalIds: ['suc-1'],
    turnos: [
      { diaSemana: 1, desde: '09:00', hasta: '18:00', sucursalId: 'suc-1' },
      { diaSemana: 2, desde: '09:00', hasta: '18:00', sucursalId: 'suc-1' },
      { diaSemana: 3, desde: '09:00', hasta: '18:00', sucursalId: 'suc-1' },
      { diaSemana: 4, desde: '09:00', hasta: '18:00', sucursalId: 'suc-1' },
      { diaSemana: 5, desde: '09:00', hasta: '17:00', sucursalId: 'suc-1' },
    ],
  },
  {
    id: 'prof-2',
    nombre: 'Dr. Luis Soto',
    especialidades: ['Odontología General', 'Cirugía Oral'],
    sucursalIds: ['suc-1', 'suc-2'],
    turnos: [
      { diaSemana: 1, desde: '08:00', hasta: '16:00', sucursalId: 'suc-1' },
      { diaSemana: 2, desde: '08:00', hasta: '16:00', sucursalId: 'suc-1' },
      { diaSemana: 3, desde: '08:00', hasta: '16:00', sucursalId: 'suc-2' },
      { diaSemana: 4, desde: '08:00', hasta: '16:00', sucursalId: 'suc-2' },
      { diaSemana: 5, desde: '08:00', hasta: '15:00', sucursalId: 'suc-1' },
    ],
  },
  {
    id: 'prof-3',
    nombre: 'Dra. Carmen Silva',
    especialidades: ['Ortodoncia'],
    sucursalIds: ['suc-1', 'suc-2'],
    turnos: [
      { diaSemana: 1, desde: '14:00', hasta: '20:00', sucursalId: 'suc-1' },
      { diaSemana: 2, desde: '14:00', hasta: '20:00', sucursalId: 'suc-2' },
      { diaSemana: 3, desde: '14:00', hasta: '20:00', sucursalId: 'suc-1' },
      { diaSemana: 4, desde: '14:00', hasta: '20:00', sucursalId: 'suc-2' },
      { diaSemana: 6, desde: '09:00', hasta: '13:00', sucursalId: 'suc-1' },
    ],
  },
];

// Datos mock de bloqueos
export const bloqueosMock: Bloqueo[] = [
  {
    fecha: '2025-10-18',
    desde: '12:00',
    hasta: '13:00',
    motivo: 'Reunión de equipo',
    sucursalId: 'suc-1',
  },
  {
    fecha: '2025-10-25',
    desde: '08:00',
    hasta: '18:00',
    motivo: 'Día feriado',
    sucursalId: 'suc-1',
  },
  {
    fecha: '2025-10-25',
    desde: '08:00',
    hasta: '18:00',
    motivo: 'Día feriado',
    sucursalId: 'suc-2',
  },
  {
    fecha: '2025-11-01',
    desde: '08:00',
    hasta: '18:00',
    motivo: 'Día de Todos los Santos',
    sucursalId: 'suc-1',
  },
  {
    fecha: '2025-11-01',
    desde: '08:00',
    hasta: '18:00',
    motivo: 'Día de Todos los Santos',
    sucursalId: 'suc-2',
  },
];

// Datos mock de usuarios
export const usuariosMock: Usuario[] = [
  {
    id: 'user-1',
    nombre: 'Administrador Principal',
    email: 'admin@clinica.cl',
    rol: 'ADMIN',
    sucursalIds: ['suc-1', 'suc-2'],
  },
  {
    id: 'user-2',
    nombre: 'Recepcionista Providencia',
    email: 'recepcion.providencia@clinica.cl',
    rol: 'RECEPCIONISTA',
    sucursalIds: ['suc-1'],
  },
  {
    id: 'user-3',
    nombre: 'Recepcionista Maipú',
    email: 'recepcion.maipu@clinica.cl',
    rol: 'RECEPCIONISTA',
    sucursalIds: ['suc-2'],
  },
  {
    id: 'user-4',
    nombre: 'Dra. Ana Pérez',
    email: 'ana.perez@clinica.cl',
    rol: 'PROFESIONAL',
    sucursalIds: ['suc-1'],
    profesionalId: 'prof-1',
  },
];

// Base de datos mock de citas
const citasMock: Cita[] = [
  {
    id: 'cita-1',
    codigo: 'DEN-2025-001001',
    sucursalId: 'suc-1',
    profesionalId: 'prof-1',
    servicioId: 'serv-1',
    fecha: '2025-10-15',
    horaInicio: '10:00',
    horaFin: '10:15',
    estado: 'PROGRAMADA',
    paciente: {
      nombre: 'Francisco Solís',
      rut: '21.342.119-0',
      telefono: '+56 9 8765 4321',
      email: 'maria@ejemplo.com',
      prevision: 'Fonasa',
    },
    creadaPor: 'PACIENTE',
    audit: {
      createdAt: '2025-10-01T10:30:00Z',
      updatedAt: '2025-10-01T10:30:00Z',
    },
  },
  {
    id: 'cita-2',
    codigo: 'DEN-2025-001002',
    sucursalId: 'suc-2',
    profesionalId: 'prof-2',
    servicioId: 'serv-2',
    fecha: '2025-10-16',
    horaInicio: '14:30',
    horaFin: '15:00',
    estado: 'CONFIRMADA',
    paciente: {
      nombre: 'Juan Pérez',
      rut: '22.333.444-5',
      telefono: '+56 9 7654 3210',
      email: 'juan@ejemplo.com',
      prevision: 'Isapre',
    },
    creadaPor: 'RECEPCIONISTA',
    audit: {
      createdAt: '2025-10-02T14:15:00Z',
      updatedAt: '2025-10-03T09:20:00Z',
    },
  },
  {
    id: 'cita-3',
    codigo: 'DEN-2025-001003',
    sucursalId: 'suc-1',
    profesionalId: 'prof-1',
    servicioId: 'serv-3',
    fecha: '2025-09-20',
    horaInicio: '16:00',
    horaFin: '17:00',
    estado: 'ATENDIDA',
    paciente: {
      nombre: 'Ana Torres',
      rut: '33.444.555-6',
      telefono: '+56 9 6543 2109',
      email: 'ana.torres@ejemplo.com',
      prevision: 'Particular',
    },
    creadaPor: 'ADMIN',
    audit: {
      createdAt: '2025-09-10T11:45:00Z',
      updatedAt: '2025-09-20T17:05:00Z',
    },
  },
];

// Datos mock de pacientes registrados
const pacientesRegistradosMock: PacienteRegistrado[] = [
  {
    id: 'pac-1',
    rut: '21.342.119-0',
    nombre: 'Francisco Solis',
    email: 'fsolism@email.com',
    telefono: '+56 9 1234 5678',
    fechaNacimiento: '2003-10-14',
    prevision: 'Fonasa',
    direccion: 'Av. Libertador Bernardo O\'Higgins 1234, Santiago',
    contactoEmergencia: {
      nombre: 'Pedro González',
      telefono: '+56 9 8765 4321',
      relacion: 'Esposo'
    },
    historialMedico: {
      alergias: ['Penicilina'],
      medicamentos: ['Aspirina'],
      condicionesMedicas: [],
      observaciones: 'Sin observaciones especiales'
    },
    fechaRegistro: '2024-01-15T10:30:00.000Z',
    ultimaActualizacion: '2024-01-15T10:30:00.000Z',
    activo: true
  },
  {
    id: 'pac-2',
    rut: '23.456.789-0',
    nombre: 'Carlos Silva',
    email: 'carlos.silva@email.com',
    telefono: '+56 9 2345 6789',
    fechaNacimiento: '1978-07-22',
    prevision: 'Isapre',
    direccion: 'Calle Los Aromos 567, Las Condes',
    contactoEmergencia: {
      nombre: 'Ana Silva',
      telefono: '+56 9 7654 3210',
      relacion: 'Esposa'
    },
    historialMedico: {
      alergias: [],
      medicamentos: [],
      condicionesMedicas: ['Hipertensión'],
      observaciones: 'Control de presión arterial antes de procedimientos'
    },
    fechaRegistro: '2024-02-10T14:20:00.000Z',
    ultimaActualizacion: '2024-02-10T14:20:00.000Z',
    activo: true
  },
  {
    id: 'pac-3',
    rut: '34.567.890-1',
    nombre: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    telefono: '+56 9 3456 7890',
    fechaNacimiento: '1992-11-08',
    prevision: 'Particular',
    fechaRegistro: '2024-03-05T09:15:00.000Z',
    ultimaActualizacion: '2024-03-05T09:15:00.000Z',
    activo: true
  }
];

// Base de contraseñas mock (en producción esto debe estar hasheado y en BD segura)
const passwordsMock: Record<string, string> = {
  'pac-1': 'demo123',
  'pac-2': 'demo123',
  'pac-3': 'demo123'
};

// Funciones utilitarias para manejar datos mock
export function obtenerCitaPorId(id: string): Cita | undefined {
  return citasMock.find(cita => cita.id === id);
}

export function obtenerCitaPorCodigo(codigo: string): Cita | undefined {
  return citasMock.find(cita => cita.codigo === codigo);
}

export function crearCita(data: Omit<Cita, 'id' | 'codigo' | 'audit'>): Cita {
  const nuevaCita: Cita = {
    ...data,
    id: `cita-${Date.now()}`,
    codigo: `DEN-2025-${Math.random().toString().slice(2, 8).padStart(6, '0')}`,
    audit: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  citasMock.push(nuevaCita);
  return nuevaCita;
}

export function actualizarCita(id: string, cambios: Partial<Cita>): Cita | null {
  const index = citasMock.findIndex(cita => cita.id === id);
  if (index === -1) return null;

  citasMock[index] = {
    ...citasMock[index],
    ...cambios,
    audit: {
      ...citasMock[index].audit,
      updatedAt: new Date().toISOString(),
    },
  };

  return citasMock[index];
}

export function eliminarCita(id: string): boolean {
  const index = citasMock.findIndex(cita => cita.id === id);
  if (index === -1) return false;

  citasMock.splice(index, 1);
  return true;
}

export function obtenerCitasPorProfesionalYFecha(profesionalId: string, fecha: string): Cita[] {
  return citasMock.filter(cita =>
    cita.profesionalId === profesionalId &&
    cita.fecha === fecha &&
    cita.estado !== 'CANCELADA'
  );
}

export function filtrarServiciosPorEspecialidad(servicios: Servicio[], especialidad: string): Servicio[] {
  return servicios.filter(servicio => servicio.especialidad === especialidad);
}

export function filtrarProfesionalesPorSucursalYEspecialidad(
  profesionales: Profesional[],
  sucursalId?: string | null,
  especialidad?: string | null
): Profesional[] {
  return profesionales.filter(profesional => {
    let cumple = true;

    if (sucursalId) {
      cumple = cumple && profesional.sucursalIds.includes(sucursalId);
    }

    if (especialidad) {
      cumple = cumple && profesional.especialidades.includes(especialidad);
    }

    return cumple;
  });
}

// Función para generar más datos mock si es necesario
export function generarCitasMockAdicionales(cantidad: number = 50): void {
  const nombres = [
    'Carlos Rodríguez', 'Patricia López', 'Fernando Martínez', 'Claudia Vargas',
    'Roberto Silva', 'Mónica Herrera', 'Diego Morales', 'Francisca Rojas',
    'Andrés Muñoz', 'Valentina Castro', 'Sebastián Jiménez', 'Camila Flores'
  ];

  const previsions = ['Fonasa', 'Isapre', 'Particular'] as const;
  const estados = ['PROGRAMADA', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA'] as const;

  for (let i = 0; i < cantidad; i++) {
    const fechaAleatoria = new Date();
    fechaAleatoria.setDate(fechaAleatoria.getDate() + Math.floor(Math.random() * 60) - 30);

    const horaAleatoria = 8 + Math.floor(Math.random() * 10); // 8-17
    const minutoAleatorio = Math.floor(Math.random() / 0.25) * 15; // 0, 15, 30, 45

    const nuevaCita: Cita = {
      id: `cita-mock-${i + 100}`,
      codigo: `DEN-2025-${String(i + 2000).padStart(6, '0')}`,
      sucursalId: Math.random() > 0.5 ? 'suc-1' : 'suc-2',
      profesionalId: `prof-${Math.floor(Math.random() * 3) + 1}`,
      servicioId: `serv-${Math.floor(Math.random() * 6) + 1}`,
      fecha: fechaAleatoria.toISOString().split('T')[0],
      horaInicio: `${horaAleatoria.toString().padStart(2, '0')}:${minutoAleatorio.toString().padStart(2, '0')}`,
      horaFin: `${horaAleatoria.toString().padStart(2, '0')}:${(minutoAleatorio + 30).toString().padStart(2, '0')}`,
      estado: estados[Math.floor(Math.random() * estados.length)],
      paciente: {
        nombre: nombres[Math.floor(Math.random() * nombres.length)],
        rut: `${Math.floor(Math.random() * 20000000) + 5000000}-${Math.floor(Math.random() * 10)}`,
        telefono: `+56 9 ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')} ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        email: `usuario${i}@ejemplo.com`,
        prevision: previsions[Math.floor(Math.random() * previsions.length)],
      },
      creadaPor: Math.random() > 0.5 ? 'PACIENTE' : 'RECEPCIONISTA',
      audit: {
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    citasMock.push(nuevaCita);
  }
}

// Funciones para manejo de pacientes registrados
export function obtenerTodosPacientesRegistrados(): PacienteRegistrado[] {
  return pacientesRegistradosMock.filter(p => p.activo);
}

export function obtenerPacientePorId(id: string): PacienteRegistrado | undefined {
  return pacientesRegistradosMock.find(p => p.id === id && p.activo);
}

export function obtenerPacientePorRut(rut: string): PacienteRegistrado | undefined {
  return pacientesRegistradosMock.find(p => p.rut === rut && p.activo);
}

export function obtenerPacientePorEmail(email: string): PacienteRegistrado | undefined {
  return pacientesRegistradosMock.find(p => p.email === email && p.activo);
}

export function autenticarPaciente(rut: string, password: string): PacienteRegistrado | null {
  const paciente = obtenerPacientePorRut(rut);
  if (!paciente) return null;

  const passwordCorrecta = passwordsMock[paciente.id] === password;
  return passwordCorrecta ? paciente : null;
}

export function registrarNuevoPaciente(datos: Omit<PacienteRegistrado, 'id' | 'fechaRegistro' | 'ultimaActualizacion' | 'activo'>, password: string): PacienteRegistrado {
  // Verificar si ya existe un paciente con el mismo RUT o email
  const pacienteExistente = pacientesRegistradosMock.find(p =>
    (p.rut === datos.rut || p.email === datos.email) && p.activo
  );

  if (pacienteExistente) {
    throw new Error('Ya existe un paciente registrado con este RUT o email');
  }

  const nuevoId = `pac-${Date.now()}`;
  const ahora = new Date().toISOString();

  const nuevoPaciente: PacienteRegistrado = {
    ...datos,
    id: nuevoId,
    fechaRegistro: ahora,
    ultimaActualizacion: ahora,
    activo: true
  };

  pacientesRegistradosMock.push(nuevoPaciente);
  passwordsMock[nuevoId] = password;

  return nuevoPaciente;
}

export function actualizarPaciente(id: string, datosActualizados: Partial<Omit<PacienteRegistrado, 'id' | 'fechaRegistro'>>): PacienteRegistrado | null {
  const indice = pacientesRegistradosMock.findIndex(p => p.id === id && p.activo);
  if (indice === -1) return null;

  pacientesRegistradosMock[indice] = {
    ...pacientesRegistradosMock[indice],
    ...datosActualizados,
    ultimaActualizacion: new Date().toISOString()
  };

  return pacientesRegistradosMock[indice];
}

export function cambiarPasswordPaciente(id: string, nuevaPassword: string): boolean {
  const paciente = obtenerPacientePorId(id);
  if (!paciente) return false;

  passwordsMock[id] = nuevaPassword;
  return true;
}
