import { Outlet, Link, useLocation } from 'react-router';
import { Heart, Calendar, Search, User } from 'lucide-react';

export function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Clínica Dental</h1>
                <p className="text-sm text-slate-600">Sistema de Citas</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Reservar Cita</span>
              </Link>

              <Link
                to="/buscar-cita"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/buscar-cita'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Buscar Cita</span>
              </Link>

              {!isAdminRoute && (
                <Link
                  to="/paciente/login"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/paciente')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Mi Cuenta</span>
                </Link>
              )}

              {isAdminRoute && (
                <div className="flex items-center space-x-6">
                  <Link
                    to="/admin/dashboard"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === '/admin/dashboard'
                        ? 'text-blue-700'
                        : 'text-slate-700 hover:text-blue-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/agenda"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === '/admin/agenda'
                        ? 'text-blue-700'
                        : 'text-slate-700 hover:text-blue-700'
                    }`}
                  >
                    Agenda
                  </Link>
                  <Link
                    to="/admin/reportes"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === '/admin/reportes'
                        ? 'text-blue-700'
                        : 'text-slate-700 hover:text-blue-700'
                    }`}
                  >
                    Reportes
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="bg-white p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menú principal</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      {!isAdminRoute && (
        <footer className="bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Clínica Dental</h3>
                    <p className="text-sm text-slate-600">Cuidando tu sonrisa</p>
                  </div>
                </div>
                <p className="text-slate-600 max-w-md">
                  Sistema moderno de reservas de citas dentales. Agenda tu cita de forma
                  rápida y sencilla, gestiona tus horarios y mantente informado sobre tus consultas.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Enlaces rápidos</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/reservar" className="text-slate-600 hover:text-blue-600 transition-colors">
                      Reservar Cita
                    </Link>
                  </li>
                  <li>
                    <Link to="/buscar" className="text-slate-600 hover:text-blue-600 transition-colors">
                      Buscar Cita
                    </Link>
                  </li>
                  <li>
                    <Link to="/paciente/registro" className="text-slate-600 hover:text-blue-600 transition-colors">
                      Registrarse
                    </Link>
                  </li>
                  <li>
                    <Link to="/paciente/login" className="text-slate-600 hover:text-blue-600 transition-colors">
                      Mi Cuenta
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/terminos" className="text-slate-600 hover:text-blue-600 transition-colors">
                      Términos y Condiciones
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacidad" className="text-slate-600 hover:text-blue-600 transition-colors">
                      Política de Privacidad
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-center text-slate-500 text-sm">
                © 2025 Clínica Dental. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
