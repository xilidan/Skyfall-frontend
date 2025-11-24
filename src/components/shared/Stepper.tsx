import {Trans} from '@lingui/react/macro'
import {ArrowLeft, ArrowRight, Check} from 'lucide-react'
import {Fragment} from 'react'
import {Button} from '../shadcn/button'

type StepperProps = {
  action: 'add' | 'edit'
  steps: {id: string; label: string; description?: string}[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  allowClickNavigation?: boolean
  nextStepClick?: () => void
  previousStepClick?: () => void
  disabledNextButton?: boolean
  isLoading?: boolean
  onSubmit?: () => void
}

const Stepper = ({
  onSubmit,
  action,
  steps,
  currentStep,
  onStepClick,
  allowClickNavigation = false,
  nextStepClick,
  previousStepClick,
  disabledNextButton = false,
  isLoading = false,
}: StepperProps) => {
  const isStepComplete = (stepIndex: number) => stepIndex < currentStep
  const isStepActive = (stepIndex: number) => stepIndex === currentStep
  const isLastStep = currentStep === steps.length - 1

  const handleStepClick = (stepIndex: number) => {
    if (allowClickNavigation && onStepClick && stepIndex <= currentStep) {
      onStepClick(stepIndex)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isComplete = isStepComplete(index)
          const isActive = isStepActive(index)
          const isClickable = allowClickNavigation && index <= currentStep

          return (
            <Fragment key={step.id}>
              <div className="flex flex-col items-center min-w-0">
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    relative z-10 flex items-center justify-center rounded-full
                    border-2 transition-all duration-300 ease-in-out
                    h-8 w-8 sm:h-10 sm:w-10
                    ${
                      isComplete
                        ? 'border-green-500 bg-green-500 text-white shadow-lg shadow-green-500/30'
                        : isActive
                        ? 'border-primary-600 bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-110'
                        : 'border-gray-300 bg-white text-gray-400'
                    }
                    ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                  `}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 animate-in fade-in zoom-in duration-300" strokeWidth={3} />
                  ) : (
                    <span className={`text-xs sm:text-sm font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {index + 1}
                    </span>
                  )}
                </button>

                <div className="mt-2 sm:mt-3 text-center max-w-[70px] sm:max-w-none">
                  <p
                    className={`text-[10px] sm:text-sm font-semibold transition-colors duration-300 leading-tight ${
                      isActive ? 'text-primary-700' : isComplete ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs text-gray-400 hidden sm:block leading-tight">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  key={`line-${step.id}`}
                  className="flex-1 h-[2px] sm:h-0.5 mx-1 sm:mx-4 bg-gray-200 relative overflow-hidden rounded-full"
                >
                  <div
                    className={`absolute inset-0 transition-all duration-500 ease-out ${
                      isComplete ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'
                    }`}
                  />
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 sm:gap-0 mt-6">
        <Button
          disabled={currentStep === 0}
          type="button"
          variant="outline"
          onClick={previousStepClick}
          className="w-full sm:w-auto"
        >
          <Trans>
            <ArrowLeft size={16} /> Previous
          </Trans>
        </Button>

        {isLastStep ? (
          <Button
            isLoading={isLoading}
            disabled={disabledNextButton}
            type="button"
            className="w-full sm:w-auto"
            onClick={onSubmit}
          >
            {action === 'add' ? <Trans>Create property</Trans> : <Trans>Update property</Trans>} <Check size={16} />
          </Button>
        ) : (
          <Button
            disabled={disabledNextButton || isLastStep}
            type="button"
            onClick={nextStepClick}
            className="w-full sm:w-auto"
          >
            <Trans>
              Next <ArrowRight size={16} />
            </Trans>
          </Button>
        )}
      </div>
    </div>
  )
}

export default Stepper
