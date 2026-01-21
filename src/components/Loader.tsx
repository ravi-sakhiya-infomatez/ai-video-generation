import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  message: string;
}

export function Loader({ message }: LoaderProps) {
  return (
    <Card className="w-full max-w-md mx-auto border-none bg-transparent shadow-none">
      <CardContent className="pt-6 space-y-8 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative bg-background/80 p-4 rounded-full border border-primary/20 backdrop-blur-md">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        </div>

        <div className="space-y-2 text-center w-full">
          <p className="text-lg font-medium text-foreground animate-pulse">{message}</p>
          <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-purple-600 animate-indeterminate-progress w-full origin-left"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}