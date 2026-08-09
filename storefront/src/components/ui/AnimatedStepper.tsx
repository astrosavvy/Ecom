"use client";

import React, { useState, Children, useRef, useLayoutEffect, HTMLAttributes, ReactNode } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Check } from "lucide-react";

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (clicked: number) => void;
  }) => ReactNode;
}

export function AnimatedStepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div
      className={`flex w-full flex-col items-center justify-center ${rest.className || ""}`}
      {...rest}
    >
      <div
        className={`mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-[#121520]/80 border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl ${stepCircleContainerClassName}`}
      >
        {/* Indicators */}
        <div className={`flex w-full items-center px-8 pt-8 pb-4 ${stepContainerClassName}`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Content Area */}
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`space-y-4 px-8 ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {/* Footer Actions */}
        {!isCompleted && (
          <div className={`px-8 pb-8 pt-4 ${footerClassName}`}>
            <div className={`flex items-center ${currentStep !== 1 ? "justify-between" : "justify-end"}`}>
              {currentStep !== 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className={`text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-white transition-colors duration-200 ${
                    currentStep === 1 ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button
                type="button"
                onClick={isLastStep ? handleComplete : handleNext}
                className="inline-flex h-12 items-center justify-center rounded-full aero-btn-primary px-8 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
                {...nextButtonProps}
              >
                {isLastStep ? "Complete Order" : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className = ""
}: {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight || "auto" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({
  children,
  direction,
  onHeightReady
}: {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? 20 : -20,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? -20 : 20,
    opacity: 0
  })
};

export function Step({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="py-2">
      {title && <h2 className="mb-3 text-lg font-bold font-space tracking-tight text-white">{title}</h2>}
      <div className="text-stone-300 leading-relaxed text-xs sm:text-sm">{children}</div>
    </div>
  );
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators = false
}: {
  step: number;
  currentStep: number;
  onClickStep: (clicked: number) => void;
  disableStepIndicators?: boolean;
}) {
  const isComplete = currentStep > step;
  const isActive = currentStep === step;

  return (
    <motion.div
      onClick={() => !disableStepIndicators && onClickStep(step)}
      className={`relative flex items-center justify-center ${!disableStepIndicators ? "cursor-pointer" : ""}`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-mono font-bold transition-all duration-300 ${
          isComplete
            ? "bg-amber-400 text-black border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
            : isActive
            ? "bg-white text-black border-white shadow-[0_0_14px_rgba(255,255,255,0.6)]"
            : "bg-white/5 text-stone-400 border-white/10"
        }`}
      >
        {isComplete ? <Check className="h-4 w-4 stroke-[3]" /> : step}
      </div>

      {isActive && (
        <motion.div
          layoutId="active-glow"
          className="absolute -inset-1 rounded-full bg-white/20 blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="relative mx-3 h-[2px] flex-1 overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="absolute inset-0 bg-amber-400 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isComplete ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      />
    </div>
  );
}
