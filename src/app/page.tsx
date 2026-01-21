'use client';

import { useStore } from '@/lib/store';
import { Stepper } from '@/components/Stepper';
import { UrlInputForm } from '@/components/UrlInputForm';
import { ProductPreview } from '@/components/ProductPreview';
import { ScriptPreview } from '@/components/ScriptPreview';
import { SelectionStep } from '@/components/SelectionStep';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Loader } from '@/components/Loader';

const loadingMessages: Record<'url' | 'product' | 'script' | 'selection' | 'video', string> = {
  url: 'Analyzing product page logistics...',
  product: 'Synthesizing persuasive ad copy...',
  script: 'Rendering high-definition video assets...',
  selection: ' preparing selection...',
  video: 'Finalizing production quality...',
};

export default function Home() {
  const { step, isLoading, error } = useStore();

  return (
    <main className="container mx-auto py-12 px-4 min-h-screen flex flex-col justify-center">
      <div className="max-w-5xl mx-auto space-y-12 w-full">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            ✨ Next-Gen AI Advertising
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent pb-2">
            AI Video Generator
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turn any product URL into a high-converting, scroll-stopping video ad in seconds.
          </p>
        </div>

        <Stepper />

        <div className="relative">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl text-center mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-20">
              <Loader message={loadingMessages[step]} />
            </div>
          ) : (
            <div className="transition-all duration-500 ease-in-out">
              {step === 'url' && <UrlInputForm />}
              {step === 'product' && <ProductPreview />}
              {step === 'script' && <ScriptPreview />}
              {step === 'selection' && <SelectionStep />}
              {step === 'video' && <VideoPlayer />}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-sm text-muted-foreground pt-12">
          Powered by <span className="text-foreground font-medium">Gemini + GPT-4</span> & <span className="text-foreground font-medium">Remotion</span>
        </div>
      </div>
    </main>
  );
}
