import { ArrowLeft, Shield, Eye, Lock, FileText } from 'lucide-react';
import { Link } from 'react-router';

export function PoliticaPrivacidad() {
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
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Política de Privacidad
            </h1>
            <p className="text-slate-600">
              Protección de Datos Personales - Clínica Dental
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Última actualización: 5 de octubre de 2025
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 space-y-8">

          {/* Introducción */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">
                Introducción
              </h2>
            </div>
            <div className="text-slate-700 space-y-3">
              <p>
                En Clínica Dental valoramos su privacidad y nos comprometemos a proteger
                sus datos personales. Esta política explica cómo recopilamos, utilizamos,
                almacenamos y protegemos su información personal de acuerdo con la
                legislación chilena vigente, particularmente la Ley 19.628 sobre
                Protección de la Vida Privada.
              </p>
              <p>
                Al utilizar nuestros servicios, usted acepta las prácticas descritas
                en esta política de privacidad.
              </p>
            </div>
          </section>

          {/* Información que recopilamos */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-slate-900">
                Información que Recopilamos
              </h2>
            </div>
            <div className="text-slate-700 space-y-4">
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Datos Personales Básicos:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Nombre completo</li>
                  <li>RUT (Rol Único Tributario)</li>
                  <li>Fecha de nacimiento</li>
                  <li>Dirección de residencia</li>
                  <li>Número de teléfono</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Información de previsión de salud</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-slate-800 mb-2">Información Médica:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Historial dental y médico relevante</li>
                  <li>Alergias conocidas</li>
                  <li>Medicamentos actuales</li>
                  <li>Condiciones médicas relevantes</li>
                  <li>Tratamientos realizados</li>
                  <li>Imágenes radiográficas y fotografías clínicas</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-slate-800 mb-2">Datos de Contacto de Emergencia:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Nombre y teléfono de contacto de emergencia</li>
                  <li>Relación con la persona de contacto</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-slate-800 mb-2">Información Técnica:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Dirección IP</li>
                  <li>Tipo de navegador y dispositivo</li>
                  <li>Páginas visitadas en nuestro sitio web</li>
                  <li>Tiempo de permanencia en el sitio</li>
                  <li>Cookies y tecnologías similares</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cómo usamos la información */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-slate-900">
                Cómo Utilizamos su Información
              </h2>
            </div>
            <div className="text-slate-700 space-y-4">
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Finalidades Principales:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Programar y gestionar citas médicas</li>
                  <li>Proporcionar atención odontológica personalizada</li>
                  <li>Mantener registros médicos precisos</li>
                  <li>Facturación y gestión de pagos</li>
                  <li>Comunicación sobre tratamientos y citas</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-slate-800 mb-2">Comunicaciones:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Confirmaciones de citas por email y SMS</li>
                  <li>Recordatorios de próximas citas</li>
                  <li>Instrucciones post-tratamiento</li>
                  <li>Información sobre nuevos servicios (con su consentimiento)</li>
                  <li>Encuestas de satisfacción</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-slate-800 mb-2">Mejora de Servicios:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Análisis de uso de la plataforma</li>
                  <li>Mejora de la experiencia del usuario</li>
                  <li>Desarrollo de nuevos servicios</li>
                  <li>Estadísticas internas (datos anonimizados)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-slate-800 mb-2">Obligaciones Legales:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Cumplimiento de regulaciones sanitarias</li>
                  <li>Reportes a autoridades de salud cuando sea requerido</li>
                  <li>Conservación de registros médicos según normativa</li>
                  <li>Respuesta a requerimientos judiciales</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Base legal */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Base Legal para el Tratamiento
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                El tratamiento de sus datos personales se basa en:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Consentimiento informado:</strong> Para tratamientos médicos y comunicaciones promocionales</li>
                <li><strong>Ejecución contractual:</strong> Para la prestación de servicios odontológicos</li>
                <li><strong>Obligación legal:</strong> Para cumplir con normativas sanitarias y fiscales</li>
                <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y seguridad</li>
                <li><strong>Interés vital:</strong> En situaciones de emergencia médica</li>
              </ul>
            </div>
          </section>

          {/* Compartir información */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Compartir Información con Terceros
            </h2>
            <div className="text-slate-700 space-y-4">
              <p>
                <strong>No vendemos ni alquilamos</strong> sus datos personales a terceros.
                Solo compartimos información en las siguientes circunstancias:
              </p>

              <div>
                <h3 className="font-medium text-slate-800 mb-2">Proveedores de Servicios:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Laboratorios dentales para fabricación de prótesis</li>
                  <li>Servicios de radiología especializada</li>
                  <li>Proveedores de tecnología (hosting, software médico)</li>
                  <li>Servicios de comunicación (email, SMS)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-slate-800 mb-2">Profesionales de la Salud:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Especialistas para referencias médicas</li>
                  <li>Otros profesionales en caso de emergencia</li>
                  <li>Seguros de salud para reembolsos</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-slate-800 mb-2">Requerimientos Legales:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Autoridades sanitarias</li>
                  <li>Tribunales de justicia</li>
                  <li>Organismos reguladores</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Seguridad */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Seguridad de los Datos
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Implementamos medidas técnicas y organizacionales apropiadas para
                proteger sus datos personales:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cifrado de datos en tránsito y en reposo</li>
                <li>Acceso restringido basado en roles</li>
                <li>Auditorías de seguridad regulares</li>
                <li>Capacitación del personal en protección de datos</li>
                <li>Backup y recuperación de datos</li>
                <li>Firewalls y sistemas de detección de intrusos</li>
                <li>Autenticación de dos factores para personal</li>
              </ul>
            </div>
          </section>

          {/* Retención de datos */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Retención de Datos
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Conservamos sus datos personales durante los siguientes períodos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Registros médicos:</strong> 15 años desde la última atención (según normativa sanitaria)</li>
                <li><strong>Datos de facturación:</strong> 6 años (según normativa tributaria)</li>
                <li><strong>Comunicaciones:</strong> 2 años desde el último contacto</li>
                <li><strong>Datos técnicos:</strong> 1 año desde la recopilación</li>
                <li><strong>Consentimientos:</strong> Durante toda la relación comercial</li>
              </ul>
              <p>
                Una vez cumplidos estos períodos, los datos son eliminados de forma segura,
                salvo que exista una obligación legal de conservarlos por más tiempo.
              </p>
            </div>
          </section>

          {/* Derechos del titular */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Sus Derechos
            </h2>
            <div className="text-slate-700 space-y-4">
              <p>
                Según la legislación chilena, usted tiene los siguientes derechos:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Acceso</h3>
                  <p className="text-sm text-blue-800">
                    Solicitar información sobre qué datos personales tenemos sobre usted
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">Rectificación</h3>
                  <p className="text-sm text-green-800">
                    Corregir datos inexactos o incompletos
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-900 mb-2">Eliminación</h3>
                  <p className="text-sm text-amber-800">
                    Solicitar la eliminación de sus datos (sujeto a obligaciones legales)
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900 mb-2">Oposición</h3>
                  <p className="text-sm text-purple-800">
                    Oponerse al tratamiento para fines específicos
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium text-slate-800 mb-2">Cómo ejercer sus derechos:</h3>
                <p className="text-sm text-slate-700 mb-2">
                  Para ejercer cualquiera de estos derechos, puede contactarnos:
                </p>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Email: privacidad@clinica-dental.cl</li>
                  <li>• Teléfono: +56 2 2234 5678</li>
                  <li>• Presencialmente en cualquiera de nuestras sucursales</li>
                  <li>• Formulario web en nuestro sitio</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Cookies y Tecnologías Similares
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Mantener su sesión activa</li>
                <li>Recordar sus preferencias</li>
                <li>Analizar el uso del sitio web</li>
                <li>Mejorar la funcionalidad</li>
                <li>Personalizar contenido</li>
              </ul>
              <p>
                Puede configurar su navegador para rechazar cookies, aunque esto
                puede afectar la funcionalidad de nuestros servicios.
              </p>
            </div>
          </section>

          {/* Menores de edad */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Menores de Edad
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Para pacientes menores de 18 años, requerimos el consentimiento
                de un padre, tutor legal o representante autorizado para:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Crear una cuenta en el sistema</li>
                <li>Recopilar y tratar datos personales</li>
                <li>Realizar tratamientos dentales</li>
                <li>Enviar comunicaciones</li>
              </ul>
            </div>
          </section>

          {/* Cambios en la política */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Cambios en esta Política
            </h2>
            <div className="text-slate-700 space-y-3">
              <p>
                Podemos actualizar esta política de privacidad ocasionalmente.
                Los cambios significativos serán notificados a través de:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Email a la dirección registrada</li>
                <li>Notificación en nuestro sitio web</li>
                <li>SMS (para cambios importantes)</li>
              </ul>
              <p>
                La fecha de la última actualización siempre aparecerá al inicio de este documento.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section className="border-t border-slate-200 pt-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Contacto y Preguntas
            </h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-3">
                Oficial de Protección de Datos
              </h3>
              <div className="text-blue-800 space-y-2">
                <p><strong>Email:</strong> privacidad@clinica-dental.cl</p>
                <p><strong>Teléfono:</strong> +56 2 2234 5678</p>
                <p><strong>Dirección:</strong> Av. Providencia 1234, Providencia, Santiago</p>
                <p><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 - 18:00 hrs</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
