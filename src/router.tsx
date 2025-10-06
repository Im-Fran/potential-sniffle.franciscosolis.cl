import { createBrowserRouter } from "react-router";
import { Home } from "@/pages/home";
import { PublicHome } from "@/pages/PublicHome";
import { BookingWizard } from "@/pages/BookingWizard";
import { BookingLookup } from "@/pages/BookingLookup";
import { TerminosCondiciones } from "@/pages/TerminosCondiciones";
import { PoliticaPrivacidad } from "@/pages/PoliticaPrivacidad";

// Admin Pages
import { Login } from "@/pages/Auth/Login";
import { AdminDashboard } from "@/pages/Admin/Dashboard";
import { AdminAgenda } from "@/pages/Admin/Agenda";
import { AdminReportes } from "@/pages/Admin/Reportes";
import { AdminConfiguracion } from "@/pages/Admin/Configuracion";
import { AdminProfesionales } from "@/pages/Admin/Profesionales";
import { AdminServicios } from "@/pages/Admin/Servicios";
import { AdminSucursales } from "@/pages/Admin/Sucursales";
import { AdminBloqueos } from "@/pages/Admin/Bloqueos";

// Patient Pages
import { LoginPaciente } from "@/pages/Paciente/LoginPaciente";
import { RegistroPaciente } from "@/pages/Paciente/RegistroPaciente";
import { DashboardPaciente } from "@/pages/Paciente/DashboardPaciente";
import { ReprogramarCita } from "@/pages/Paciente/ReprogramarCita";

// Layout Components
import { Layout } from "@/components/Layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      // Página principal pública
      { index: true, element: <PublicHome /> },

      // Rutas públicas
      { path: 'reservar', element: <BookingWizard /> },
      { path: 'buscar-cita', element: <BookingLookup /> },
      { path: 'cita/:codigo', element: <BookingLookup /> },
      { path: 'terminos', element: <TerminosCondiciones /> },
      { path: 'privacidad', element: <PoliticaPrivacidad /> },

      // Autenticación Admin
      { path: 'admin/login', element: <Login /> },

      // Dashboard Admin (protegido)
      {
        path: 'admin',
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'agenda', element: <AdminAgenda /> },
          { path: 'reportes', element: <AdminReportes /> },
          { path: 'configuracion', element: <AdminConfiguracion /> },
          { path: 'profesionales', element: <AdminProfesionales /> },
          { path: 'servicios', element: <AdminServicios /> },
          { path: 'sucursales', element: <AdminSucursales /> },
          { path: 'bloqueos', element: <AdminBloqueos /> },
        ]
      },

      // Autenticación Paciente
      { path: 'paciente/login', element: <LoginPaciente /> },
      { path: 'paciente/registro', element: <RegistroPaciente /> },

      // Dashboard Paciente (protegido)
      {
        path: 'paciente',
        children: [
          { path: 'dashboard', element: <DashboardPaciente /> },
          { path: 'citas', element: <DashboardPaciente /> },
          { path: 'reprogramar/:citaId', element: <ReprogramarCita /> },
        ]
      },

      // Ruta de desarrollo/admin home
      { path: 'home', element: <Home /> },
    ]
  },

  // Rutas de error
  {
    path: '*',
    element: <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
        <p className="text-slate-600 mb-6">Página no encontrada</p>
        <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Volver al inicio
        </a>
      </div>
    </div>
  }
]);
