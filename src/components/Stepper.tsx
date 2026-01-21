import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const steps = [
  { id: 'url', label: 'Input URL' },
  { id: 'product', label: 'Review Details' },
  { id: 'script', label: 'AI Script' },
  { id: 'video', label: 'Final Video' },
] as const;

export function Stepper() {
  const { step } = useStore();
  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative flex items-center justify-between">

        {/* Connecting Lines Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 rounded-full" />

        {/* Dynamic Progress Line */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((s, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold border-2 transition-all duration-300 shadow-xl backdrop-blur-md',
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : isCurrent
                      ? 'bg-background/80 border-primary text-primary scale-110 ring-4 ring-primary/20 shadow-primary/20'
                      : 'bg-muted/20 border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
              </div>
              <div className={cn(
                "text-xs font-bold tracking-widest transition-colors duration-300 uppercase",
                isCurrent ? "text-primary drop-shadow-sm" : "text-muted-foreground"
              )}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}