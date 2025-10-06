import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export function TerminosCondiciones() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Términos y Condiciones
            </h1>
            <p className="text-slate-600">
              Clínica Dental - Sistema de Reserva de Citas Online
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Última actualización: 5 de octubre de 2025
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 space-y-8">

          {/* 1. Aceptación de términos */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              1. Aceptación de los Términos
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Al utilizar nuestro sistema de reserva de citas online y servicios odontológicos,
                usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo
                con alguna parte de estos términos, no debe utilizar nuestros servicios.
              </p>
              <p>
                Estos términos se aplican a todos los usuarios del sistema, incluyendo pacientes,
                visitantes y cualquier persona que acceda a nuestros servicios online.
              </p>
            </div>
          </section>

          {/* 2. Servicios ofrecidos */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              2. Servicios Ofrecidos
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Nuestra clínica dental ofrece los siguientes servicios a través de la plataforma online:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Reserva de citas odontológicas online</li>
                <li>Gestión y modificación de citas existentes</li>
                <li>Consulta de historial de citas</li>
                <li>Servicios dentales profesionales en nuestras sucursales</li>
                <li>Atención de urgencias dentales</li>
                <li>Tratamientos preventivos y curativos</li>
              </ul>
            </div>
          </section>

          {/* 3. Registro de usuario */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              3. Registro de Usuario y Cuenta
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Para utilizar nuestros servicios, debe crear una cuenta proporcionando información
                precisa y completa. Usted es responsable de:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Mantener la confidencialidad de su contraseña</li>
                <li>Actualizar su información personal cuando sea necesario</li>
                <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
                <li>Proporcionar información veraz y actualizada</li>
              </ul>
            </div>
          </section>

          {/* 4. Política de citas */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              4. Política de Citas
            </h2>
            <div className="text-slate-700 space-y-3">
              <h3 className="font-medium text-slate-800">Reservas:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Las citas deben reservarse con al menos 2 horas de anticipación</li>
                <li>Confirmamos todas las citas por email y/o SMS</li>
                <li>Se requiere llegar 10 minutos antes de la hora programada</li>
              </ul>

              <h3 className="font-medium text-slate-800 mt-4">Cancelaciones y Reprogramaciones:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Pueden realizarse hasta 24 horas antes de la cita</li>
                <li>Cancelaciones tardías pueden resultar en cargos</li>
                <li>Tres inasistencias consecutivas pueden resultar en suspensión temporal</li>
              </ul>

              <h3 className="font-medium text-slate-800 mt-4">No Presentación:</h3>
              <p className="ml-4">
                Si no se presenta a su cita sin cancelar previamente, esto se registrará como
                "no-show" y puede afectar futuras reservas.
              </p>
            </div>
          </section>

          {/* 5. Tratamiento de datos */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              5. Tratamiento de Datos Personales
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Recopilamos y tratamos sus datos personales de acuerdo con nuestra Política de
                Privacidad y la legislación chilena aplicable (Ley 19.628). Los datos se utilizan para:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Programar y gestionar sus citas médicas</li>
                <li>Enviar recordatorios y confirmaciones</li>
                <li>Mantener su historial médico dental</li>
                <li>Mejorar la calidad de nuestros servicios</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
              </ul>
              <p>
                Sus datos médicos están protegidos por el secreto profesional y solo son
                accesibles por personal autorizado para su atención.
              </p>
            </div>
          </section>

          {/* 6. Responsabilidades */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              6. Responsabilidades
            </h2>
            <div className="text-slate-700 space-y-3">
              <h3 className="font-medium text-slate-800">Del Paciente:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Proporcionar información médica precisa y completa</li>
                <li>Informar sobre alergias, medicamentos y condiciones médicas</li>
                <li>Seguir las instrucciones post-tratamiento</li>
                <li>Cumplir con los pagos acordados</li>
              </ul>

              <h3 className="font-medium text-slate-800 mt-4">De la Clínica:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Proporcionar atención odontológica profesional y de calidad</li>
                <li>Mantener la confidencialidad de la información médica</li>
                <li>Cumplir con los estándares sanitarios establecidos</li>
                <li>Informar sobre tratamientos, riesgos y alternativas</li>
              </ul>
            </div>
          </section>

          {/* 7. Limitación de responsabilidad */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              7. Limitación de Responsabilidad
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                La clínica no será responsable por:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Interrupciones del servicio por mantenimiento programado</li>
                <li>Problemas técnicos temporales de la plataforma</li>
                <li>Decisiones médicas basadas en información incompleta del paciente</li>
                <li>Reacciones adversas no previsibles a tratamientos estándar</li>
              </ul>
            </div>
          </section>

          {/* 8. Propiedad intelectual */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              8. Propiedad Intelectual
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Todo el contenido de la plataforma, incluyendo textos, imágenes, logos,
                software y diseño, está protegido por derechos de autor y otras leyes
                de propiedad intelectual. Queda prohibida su reproducción sin autorización.
              </p>
            </div>
          </section>

          {/* 9. Modificaciones */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              9. Modificaciones a los Términos
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento.
                Las modificaciones serán notificadas a través de la plataforma y/o por email.
                El uso continuado de nuestros servicios constituye aceptación de los términos modificados.
              </p>
            </div>
          </section>

          {/* 10. Ley aplicable */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              10. Ley Aplicable y Jurisdicción
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Estos términos se rigen por las leyes de la República de Chile.
                Cualquier controversia será resuelta por los tribunales competentes
                de Santiago, Chile.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section className="border-t border-slate-200 pt-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Información de Contacto
            </h2>
            <div className="text-slate-700 space-y-2">
              <p><strong>Clínica Dental</strong></p>
              <p>Sucursal Providencia: Av. Providencia 1234, Providencia, Santiago</p>
              <p>Sucursal Maipú: Av. Américo Vespucio 456, Maipú, Santiago</p>
              <p>Teléfono: +56 2 2234 5678</p>
              <p>Email: info@clinica-dental.cl</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
