import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Player } from '@remotion/player';
import { AdVideo } from './video/AdVideo';
import { Download, Monitor, Smartphone, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function VideoPlayer() {
  const { script, product, videoMode, setError } = useStore();
  const [downloading, setDownloading] = useState<string | null>(null);

  // State for AI generated videos
  const [aiMobileUrl, setAiMobileUrl] = useState<string | null>(null);
  const [aiDesktopUrl, setAiDesktopUrl] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState<'portrait' | 'landscape' | null>(null);

  if (!script || !product) return null;

  const handleGenerateOrDownload = async (format: 'portrait' | 'landscape') => {
    // If AI mode and already generated, just download
    // (Actually the browser <video> has download, but let's keep the button)
    const existingUrl = format === 'portrait' ? aiMobileUrl : aiDesktopUrl;

    if (videoMode === 'ai' && existingUrl) {
      const link = document.createElement('a');
      link.href = existingUrl;
      link.download = `ai-ad-${format}-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    try {
      const isAiGeneration = videoMode === 'ai' && !existingUrl;

      if (isAiGeneration) {
        setIsGeneratingAi(format);
      } else {
        setDownloading(format);
      }

      setError(null);

      const response = await fetch('/api/render-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          product, // Pass product as well
          format,
          videoMode // Pass selected video mode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process video');
      }

      const videoUrl = data.videoUrl;

      if (videoMode === 'ai') {
        // Save the URL for the player
        if (format === 'portrait') setAiMobileUrl(videoUrl);
        else setAiDesktopUrl(videoUrl);
      } else {
        // Remotion immediate download
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `ad-${format}-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

    } catch (error) {
      console.error('Error processing video:', error);
      setError('Failed to process video. Please try again.');
    } finally {
      setDownloading(null);
      setIsGeneratingAi(null);
    }
  };

  const renderContent = (format: 'portrait' | 'landscape') => {
    const isPortrait = format === 'portrait';
    const aiUrl = isPortrait ? aiMobileUrl : aiDesktopUrl;
    const isGenerating = isGeneratingAi === format;

    // Remotion Render (Standard Mode)
    if (videoMode === 'remotion') {
      return (
        <div className={`aspect-${isPortrait ? '[9/16]' : 'video'} ${isPortrait ? 'h-[600px]' : 'w-full max-w-3xl'} bg-black rounded-2xl overflow-hidden border-4 border-gray-800 shadow-2xl relative mx-auto`}>
          {/* Phone Notch for mobile */}
          {isPortrait && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black z-20 rounded-b-xl" />}
          <Player
            component={AdVideo}
            durationInFrames={450}
            fps={30}
            compositionWidth={isPortrait ? 1080 : 1920}
            compositionHeight={isPortrait ? 1920 : 1080}
            style={{ width: '100%', height: '100%' }}
            inputProps={{ script, product, isAdvanced: false }}
            controls
          />
        </div>
      );
    }

    // AI Mode
    // 1. If Generated: Show Video Player
    if (aiUrl) {
      return (
        <div className={`aspect-${isPortrait ? '[9/16]' : 'video'} ${isPortrait ? 'h-[600px]' : 'w-full max-w-3xl'} bg-black rounded-2xl overflow-hidden border-border/50 shadow-2xl relative mx-auto flex items-center justify-center`}>
          <video
            src={aiUrl}
            controls
            className="w-full h-full object-contain"
            autoPlay
          />
        </div>
      );
    }

    // 2. If generating or empty: Show Placeholder/Loader
    return (
      <div className={`aspect-${isPortrait ? '[9/16]' : 'video'} ${isPortrait ? 'h-[600px]' : 'w-full max-w-3xl'} bg-black/40 rounded-2xl overflow-hidden border border-border/50 shadow-2xl relative mx-auto flex flex-col items-center justify-center p-8 text-center space-y-6`}>
        {isGenerating ? (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Generating AI Video...</h3>
              <p className="text-muted-foreground max-w-xs">Connecting to Google Veo model. This may take up to a minute.</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/20">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Ready to Generate</h3>
              <p className="text-muted-foreground max-w-sm">Create a fully AI-generated video using standard Veo models.</p>
            </div>
            <Button
              size="lg"
              onClick={() => handleGenerateOrDownload(format)}
              className="bg-primary hover:bg-primary/90 text-white min-w-[200px]"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate {isPortrait ? 'Mobile' : 'Desktop'} Video
            </Button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {videoMode === 'ai' ? 'AI Video Engine' : 'Your Ads Are Ready!'}
        </h2>
        <p className="text-muted-foreground">Preview your generated ads for Mobile and Desktop below.</p>
      </div>

      <Tabs defaultValue="portrait" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-muted/50 p-1 backdrop-blur-sm">
          <TabsTrigger value="portrait" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
            <Smartphone className="w-4 h-4 mr-2" /> Mobile (9:16)
          </TabsTrigger>
          <TabsTrigger value="landscape" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
            <Monitor className="w-4 h-4 mr-2" /> Desktop (16:9)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portrait" className="mt-0">
          <Card className="border-primary/10 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="text-xl flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" /> Mobile Reel Preview
                {videoMode === 'ai' && <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">Veo Model</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex justify-center bg-black/40">
              {renderContent('portrait')}
            </CardContent>
            {/* Show footer download button only if AI video is generated OR if in standard mode */}
            {(videoMode === 'remotion' || aiMobileUrl) && (
              <CardFooter className="p-6 bg-muted/30 border-t border-border/50">
                <Button
                  onClick={() => handleGenerateOrDownload('portrait')}
                  disabled={!!downloading || !!isGeneratingAi}
                  className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25 transition-all duration-300 transform hover:scale-[1.01]"
                >
                  {downloading === 'portrait' ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Downloading...</>
                  ) : (
                    <><Download className="w-5 h-5 mr-2" /> Download Mobile Video</>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="landscape" className="mt-0">
          <Card className="border-primary/10 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="text-xl flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" /> YouTube Video Preview
                {videoMode === 'ai' && <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">Veo Model</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex justify-center bg-black/40">
              {renderContent('landscape')}
            </CardContent>
            {(videoMode === 'remotion' || aiDesktopUrl) && (
              <CardFooter className="p-6 bg-muted/30 border-t border-border/50">
                <Button
                  onClick={() => handleGenerateOrDownload('landscape')}
                  disabled={!!downloading || !!isGeneratingAi}
                  className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25 transition-all duration-300 transform hover:scale-[1.01]"
                >
                  {downloading === 'landscape' ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Downloading...</>
                  ) : (
                    <><Download className="w-5 h-5 mr-2" /> Download Desktop Video</>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}