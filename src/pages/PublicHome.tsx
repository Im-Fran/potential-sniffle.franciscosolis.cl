import { Link } from 'react-router';
import { Calendar, Clock, MapPin, Shield, Star, Users } from 'lucide-react';

export function PublicHome() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Tu sonrisa es nuestra
              <span className="text-blue-600 block">prioridad</span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Reserva tu cita dental online de forma rápida y sencilla.
              Atención profesional con tecnología moderna en nuestras sucursales de Santiago.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/reservar"
                className="inline-flex items-center justify-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                <span>Reservar Cita Online</span>
              </Link>

              <Link
                to="/buscar-cita"
                className="inline-flex items-center justify-center space-x-3 bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <Clock className="w-5 h-5" />
                <span>Gestionar mi Cita</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Características */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Brindamos atención odontológica integral con los más altos estándares de calidad y comodidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Profesionales Especializados
              </h3>
              <p className="text-slate-600">
                Contamos con odontólogos especializados en diferentes áreas: general, endodoncia y ortodoncia.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Protocolos de Seguridad
              </h3>
              <p className="text-slate-600">
                Seguimos estrictos protocolos de higiene y seguridad para garantizar tu bienestar y tranquilidad.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Tecnología Moderna
              </h3>
              <p className="text-slate-600">
                Equipamiento de última generación para diagnósticos precisos y tratamientos más eficaces.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Servicios */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-slate-600">
              Ofrecemos una amplia gama de servicios odontológicos para toda la familia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { nombre: 'Control', descripcion: 'Evaluación dental general', duracion: '15 min' },
              { nombre: 'Limpieza/Profilaxis', descripcion: 'Limpieza profunda y pulido', duracion: '30 min' },
              { nombre: 'Urgencias', descripcion: 'Atención inmediata del dolor', duracion: '30 min' },
              { nombre: 'Endodoncia', descripcion: 'Tratamiento de conducto', duracion: '60 min' },
            ].map((servicio) => (
              <div key={servicio.nombre} className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="font-semibold text-slate-900 mb-2">{servicio.nombre}</h3>
                <p className="text-slate-600 text-sm mb-3">{servicio.descripcion}</p>
                <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {servicio.duracion}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sucursales */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Nuestras Sucursales
            </h2>
            <p className="text-lg text-slate-600">
              Tenemos dos convenientes ubicaciones para atenderte mejor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Providencia</h3>
                  <p className="text-slate-600 mb-4">Av. Providencia 1234, Providencia, Santiago</p>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p><strong>Teléfono:</strong> +56 2 2234 5678</p>
                    <p><strong>Horarios:</strong> Lun-Vie 8:00-19:00, Sáb 9:00-14:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Maipú</h3>
                  <p className="text-slate-600 mb-4">Av. Américo Vespucio 456, Maipú, Santiago</p>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p><strong>Teléfono:</strong> +56 2 2876 5432</p>
                    <p><strong>Horarios:</strong> Lun-Vie 8:30-18:30, Sáb 9:00-13:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para cuidar tu sonrisa?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Reserva tu cita ahora y recibe atención profesional en el horario que más te convenga.
          </p>

          <Link
            to="/reservar"
            className="inline-flex items-center justify-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            <Calendar className="w-5 h-5" />
            <span>Reservar Cita Ahora</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
