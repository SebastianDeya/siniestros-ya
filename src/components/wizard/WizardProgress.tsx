"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardProgressProps {
  currentStep: number;
  steps: string[];
}

export default function WizardProgress({ currentStep, steps }: WizardProgressProps) {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="flex items-center justify-between min-w-[600px] px-2 py-4">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shrink-0",
                    isCompleted && "bg-success text-white",
                    isActive && "bg-primary text-white ring-4 ring-primary/20",
                    !isCompleted && !isActive && "bg-gray-200 text-gray-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs text-center whitespace-nowrap font-medium transition-colors duration-300",
                    isActive && "text-primary",
                    isCompleted && "text-success",
                    !isCompleted && !isActive && "text-gray-400"
                  )}
                >
                  {label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-3 mt-[-1.5rem] transition-colors duration-300",
                    stepNumber < currentStep ? "bg-success" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
