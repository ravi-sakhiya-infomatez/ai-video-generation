import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { FileText, ArrowRight } from 'lucide-react';

export function ScriptPreview() {
  const { script, product, setLoading, setError, setStep } = useStore();

  if (!script || !product) return null;

  const handleGenerateVideo = async () => {
    setLoading(true);
    setError(null);
    // Simulate processing delay or just switch to video step where real rendering happens
    // The previous API call to /api/generate-video was just returning a fake URL anyway.
    // We can skip it or keep it if it does some necessary prep, but looking at the code it didn't do much.
    // Since Step 4 (VideoPlayer) handles everything locally/via render-video API, we can just switch step.

    setTimeout(() => {
      setStep('selection');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Script Section */}
      <Card className="h-full border-primary/10 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl flex flex-col">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">AI Generated Script</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose prose-invert prose-sm max-w-none p-4 bg-muted/20 rounded-lg border border-border/50 h-[500px] overflow-y-auto custom-scrollbar">
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground font-mono text-sm">
              {script}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-muted/30 border-t border-border/50">
          <Button
            onClick={handleGenerateVideo}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25 transition-all duration-300 transform hover:scale-[1.01]"
          >
            Render Final Video <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}