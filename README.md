# Sistema de Agenda de Citas - Clínica Dental

Una aplicación web completa para gestión de citas odontológicas construida con React, TypeScript y TailwindCSS. Permite reservas online para pacientes y gestión interna para profesionales de la salud.

## 🚀 Características Principales

### Para Pacientes (Acceso Público)
- **Reserva de citas online** con wizard multi-step
- Selección de sucursal, servicio, profesional, fecha y hora
- Validación en tiempo real de disponibilidad
- Confirmación con código de cita único
- Descarga de archivo .ics para calendarios
- Gestión de citas (consultar, reprogramar, cancelar)
- Formulario con validación de RUT chileno
- Notificaciones por email y SMS (simuladas)

### Para Personal (Acceso Administrativo)
- **Dashboard** con métricas y KPIs
- **Agenda** con vista diaria y filtros
- Sistema de roles (Admin, Recepcionista, Profesional)
- Gestión de disponibilidad y horarios
- Reportes básicos de utilización

### Características Técnicas
- **Zona horaria Chile (America/Santiago)** con manejo de horario de verano
- **Formato chileno**: DD/MM/YYYY, horario 24h, validación RUT
- **API mock completa** con MSW (Mock Service Worker)
- **Responsive design** móvil-first
- **Accesibilidad WCAG AA** con navegación por teclado y ARIA
- **Validaciones robustas** con React Hook Form + Zod

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Vite
- **Estilos**: TailwindCSS 4
- **Formularios**: React Hook Form + Zod
- **Estado servidor**: TanStack Query (React Query)
- **Enrutamiento**: React Router 7
- **Fechas**: date-fns + date-fns-tz
- **Mock API**: MSW (Mock Service Worker)
- **Iconos**: Lucide React

## 📋 Requisitos Previos

- Node.js 18+ o Bun 1.0+
- Navegador moderno con soporte ES2022

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd dashboard-clinica-dental
```

### 2. Instalar dependencias
```bash
# Con Bun (recomendado)
bun install

# O con npm
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
# Con Bun
bun dev

# O con npm
npm run dev
```

### 4. Abrir en el navegador
Visita [http://localhost:5173](http://localhost:5173)

## 🏥 Datos de Demostración

### Sucursales
- **Providencia**: Av. Providencia 1234, Providencia, Santiago
- **Maipú**: Av. Américo Vespucio 456, Maipú, Santiago

### Servicios Disponibles
- **Control** (15 min) - Evaluación dental general
- **Limpieza/Profilaxis** (30 min) - Limpieza profunda
- **Urgencia** (30 min) - Atención inmediata
- **Endodoncia** (60 min) - Tratamiento de conducto

### Profesionales
- **Dra. Ana Pérez** - Odontología General, Endodoncia
- **Dr. Luis Soto** - Odontología General

### Cuentas de Acceso Administrativo
- **Admin**: admin@clinica.cl / demo123
- **Recepcionista**: recepcion@clinica.cl / demo123  
- **Profesional**: ana.perez@clinica.cl / demo123

## 🎯 Flujo de Usuario

### Reserva de Cita (Paciente)
1. **Sucursal** → Seleccionar ubicación
2. **Servicio** → Tipo de atención needed
3. **Profesional** → Dentista específico o "cualquiera"
4. **Fecha** → Calendario con disponibilidad
5. **Hora** → Grid de horarios disponibles
6. **Datos** → Información personal y contacto
7. **Confirmar** → Resumen y confirmación final

### Gestión Interna (Personal)
1. **Login** → Autenticación por rol
2. **Dashboard** → Métricas y resumen de actividad
3. **Agenda** → Vista diaria con filtros
4. **Gestión** → Crear, modificar y cancelar citas

## 🔧 Configuración Avanzada

### Variables de Entorno
Crea un archivo `.env.local` para configuraciones personalizadas:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_MSW=true
VITE_DEFAULT_TIMEZONE=America/Santiago
```

### Personalización de Horarios
Los horarios y disponibilidad se configuran en:
- `src/api/mockData.ts` - Datos mock de profesionales y turnos
- `src/lib/time.ts` - Lógica de generación de slots

### Reglas de Negocio
- **Anticipación cancelación**: 24 horas mínimo
- **Intervalos de reserva**: 15 minutos
- **Horarios atención**: 8:00 - 19:00 (configurable por sucursal)
- **Buffers entre servicios**: Configurable por tipo de servicio

## 🧪 Testing

```bash
# Ejecutar tests unitarios
bun test

# Tests de integración con Playwright
bun test:e2e
```

## 🚀 Deployment

### Build para producción
```bash
bun run build
```

### Preview del build
```bash
bun run preview
```

## 📱 Responsive Design

La aplicación está optimizada para:
- **Móvil**: iPhone SE (375px) y superiores
- **Tablet**: iPad (768px) y superiores  
- **Desktop**: 1280px y superiores

## ♿ Accesibilidad

- Navegación completa por teclado
- Labels y roles ARIA apropiados
- Contraste AA (4.5:1 mínimo)
- Textos alternativos para elementos visuales
- Estados de foco visibles

## 🇨🇱 Localización Chile

- **Formato fecha**: DD/MM/YYYY
- **Horario**: 24 horas (HH:mm)
- **Zona horaria**: America/Santiago (incluye horario de verano)
- **Validación RUT**: Módulo 11 con formateo XX.XXX.XXX-X
- **Teléfono**: +56 9 #### #### (formato móvil Chile)
- **Moneda**: Pesos chilenos (CLP)

## 📝 Estructura del Proyecto

```
src/
├── api/              # Cliente API y handlers MSW
│   ├── client.ts     # Cliente HTTP
│   ├── handlers.ts   # Handlers MSW
│   ├── mockData.ts   # Datos de demostración
│   └── worker.ts     # Service Worker MSW
├── app/              # Configuración de la aplicación
│   ├── queryClient.tsx  # React Query setup
│   └── router.tsx    # React Router setup
├── components/       # Componentes reutilizables
│   ├── BookingWizard/   # Steps del wizard de reserva
│   ├── ErrorBoundary.tsx
│   ├── Layout.tsx
│   ├── LoadingSpinner.tsx
│   └── ...
├── hooks/            # Custom hooks
│   └── useApi.ts     # Hooks React Query
├── lib/              # Utilidades
│   ├── ics.ts        # Generación archivos calendario
│   ├── rut.ts        # Validación RUT chileno
│   ├── time.ts       # Manejo fechas y zona horaria
│   └── utils.ts      # Utilidades generales
├── pages/            # Páginas principales
│   ├── Admin/        # Páginas administrativas
│   ├── Auth/         # Autenticación
│   ├── BookingLookup.tsx  # Buscar citas
│   ├── BookingWizard.tsx  # Wizard reserva
│   └── PublicHome.tsx     # Página inicial
└── types/            # Tipos TypeScript
    └── domain.ts     # Tipos de dominio
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

Para reportar bugs o solicitar nuevas funcionalidades, abre un [issue](../../issues) en GitHub.

---

**Desarrollado con ❤️ para mejorar la experiencia de reserva de citas odontológicas en Chile.**
