import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  getMaxAllowedStep: () => number;
  isStepValid: (stepIndex: number) => boolean;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  getMaxAllowedStep,
  isStepValid
}: StepperProps) {
  const maxAllowedStep = getMaxAllowedStep();

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep && isStepValid(stepIndex)) {
      return 'completed';
    } else if (stepIndex === currentStep) {
      return 'current';
    } else if (stepIndex <= maxAllowedStep) {
      return 'upcoming';
    } else {
      return 'disabled';
    }
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          container: 'cursor-pointer',
          circle: 'bg-green-600 border-green-600 text-white',
          title: 'text-slate-900 font-medium',
          description: 'text-slate-600',
        };
      case 'current':
        return {
          container: 'cursor-default',
          circle: 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100',
          title: 'text-blue-600 font-medium',
          description: 'text-blue-600',
        };
      case 'upcoming':
        return {
          container: 'cursor-pointer',
          circle: 'bg-white border-slate-300 text-slate-500 hover:border-slate-400',
          title: 'text-slate-500 hover:text-slate-700',
          description: 'text-slate-400',
        };
      case 'disabled':
      default:
        return {
          container: 'cursor-not-allowed',
          circle: 'bg-slate-100 border-slate-200 text-slate-400',
          title: 'text-slate-400',
          description: 'text-slate-300',
        };
    }
  };

  const handleStepClick = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    if ((status === 'completed' || status === 'upcoming') && onStepClick) {
      onStepClick(stepIndex);
    }
  };

  return (
    <nav aria-label="Progreso de reserva">
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const styles = getStepStyles(status);
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className="flex items-center flex-1">
              {/* Step */}
              <div
                className={`relative flex flex-col items-center ${styles.container}`}
                onClick={() => handleStepClick(index)}
              >
                {/* Circle */}
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                    ${styles.circle}
                  `}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Labels - Hidden on mobile, shown on larger screens */}
                <div className="mt-3 text-center hidden md:block">
                  <div className={`text-sm transition-colors ${styles.title}`}>
                    {step.title}
                  </div>
                  <div className={`text-xs mt-1 transition-colors ${styles.description}`}>
                    {step.description}
                  </div>
                </div>

                {/* Mobile labels - Only show for current step */}
                <div className="mt-2 text-center md:hidden">
                  {status === 'current' && (
                    <div className="text-sm font-medium text-blue-600">
                      {step.title}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 mx-2 md:mx-4">
                  <div
                    className={`
                      h-0.5 transition-colors duration-200
                      ${status === 'completed' || currentStep > index 
                        ? 'bg-green-600' 
                        : 'bg-slate-200'
                      }
                    `}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
