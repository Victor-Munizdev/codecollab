import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text: string;
}

export function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-glow rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-gradient-primary rounded-full flex items-center justify-center shadow-primary">
            <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
          </div>
        </div>
        <p className="text-lg font-medium text-foreground">{text}</p>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}