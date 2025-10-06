import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReservaStep } from '../types/domain';
import { Stepper } from '../components/Stepper';
import { StepSucursal } from '../components/BookingWizard/StepSucursal';
import { StepServicio } from '../components/BookingWizard/StepServicio';
import { StepProfesional } from '../components/BookingWizard/StepProfesional';
import { StepFecha } from '../components/BookingWizard/StepFecha';
import { StepHora } from '../components/BookingWizard/StepHora';
import { StepPaciente } from '../components/BookingWizard/StepPaciente';
import { StepResumen } from '../components/BookingWizard/StepResumen';

const STEPS = [
  { id: 'sucursal', title: 'Sucursal', description: 'Elige tu ubicación' },
  { id: 'servicio', title: 'Servicio', description: 'Tipo de atención' },
  { id: 'profesional', title: 'Profesional', description: 'Elige tu dentista' },
  { id: 'fecha', title: 'Fecha', description: 'Selecciona el día' },
  { id: 'hora', title: 'Hora', description: 'Horario disponible' },
  { id: 'paciente', title: 'Datos', description: 'Información personal' },
  { id: 'resumen', title: 'Confirmar', description: 'Revisar y confirmar' },
];

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [reservaData, setReservaData] = useState<ReservaStep>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateReservaData = useCallback((data: Partial<ReservaStep>) => {
    setReservaData(prev => ({ ...prev, ...data }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      // Scroll al top cuando cambia el step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const goToStep = useCallback((stepIndex: number) => {
    // Solo permitir ir a steps ya completados o el siguiente
    const maxAllowedStep = getMaxAllowedStep();
    if (stepIndex <= maxAllowedStep) {
      setCurrentStep(stepIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [reservaData]);

  const getMaxAllowedStep = useCallback(() => {
    // Determinar hasta qué step puede navegar el usuario
    if (!reservaData.sucursal) return 0;
    if (!reservaData.servicio) return 1;
    if (!reservaData.profesional) return 2;
    if (!reservaData.fecha) return 3;
    if (!reservaData.hora) return 4;
    if (!reservaData.paciente) return 5;
    return 6; // Puede llegar hasta resumen
  }, [reservaData]);

  const isStepValid = useCallback((stepIndex: number) => {
    switch (stepIndex) {
      case 0: return !!reservaData.sucursal;
      case 1: return !!reservaData.servicio;
      case 2: return !!reservaData.profesional;
      case 3: return !!reservaData.fecha;
      case 4: return !!reservaData.hora;
      case 5: return !!reservaData.paciente;
      case 6: return true; // Resumen siempre válido si llegó aquí
      default: return false;
    }
  }, [reservaData]);

  const canProceedToNext = useCallback(() => {
    return isStepValid(currentStep) && !isLoading;
  }, [currentStep, isStepValid, isLoading]);

  const renderCurrentStep = () => {
    const commonProps = {
      reservaData,
      updateReservaData,
      nextStep,
      setIsLoading,
    };

    switch (currentStep) {
      case 0:
        return (
          <StepSucursal
            {...commonProps}
          />
        );
      case 1:
        return (
          <StepServicio
            {...commonProps}
          />
        );
      case 2:
        return (
          <StepProfesional
            {...commonProps}
          />
        );
      case 3:
        return (
          <StepFecha
            {...commonProps}
          />
        );
      case 4:
        return (
          <StepHora
            {...commonProps}
          />
        );
      case 5:
        return (
          <StepPaciente
            {...commonProps}
          />
        );
      case 6:
        return (
          <StepResumen
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Reservar Cita Dental
          </h1>
          <p className="text-slate-600">
            Complete los siguientes pasos para agendar su cita
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <Stepper
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={goToStep}
            getMaxAllowedStep={getMaxAllowedStep}
            isStepValid={isStepValid}
          />
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8 mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="text-sm text-slate-500">
            Paso {currentStep + 1} de {STEPS.length}
          </div>

          {currentStep < STEPS.length - 1 && (
            <button
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-6">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
