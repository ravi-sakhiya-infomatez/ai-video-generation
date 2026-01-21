import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Product } from '@/types/product';
import { Sparkles, Package, Info } from 'lucide-react';

export function ProductPreview() {
  const { product, setLoading, setError, setScript, setStep } = useStore();

  if (!product) return null;

  const handleGenerateScript = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate script');
      }

      setScript(data.script);
      setStep('script');
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const displayImage = product.image.includes('360') || product.image.toLowerCase().includes('spin')
    ? (product.images.find(img => !img.includes('360') && !img.toLowerCase().includes('spin')) || product.image)
    : product.image;

  return (
    <Card className="w-full max-w-4xl mx-auto border-primary/10 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl">Product Analysis</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-border/50 bg-background/50 group">
          <Image
            src={displayImage}
            alt={product.title}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            quality={100}
            unoptimized
          />
        </div>

        {/* Details Section */}
        <div className="space-y-6 flex flex-col justify-center">
          <div>
            <h3 className="text-2xl font-bold leading-tight line-clamp-2 mb-2">{product.title}</h3>
            {product.price && (
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-md font-semibold text-lg">
                {product.price}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Info className="w-4 h-4 text-primary" />
                Key Highlights
              </div>
              <ul className="grid grid-cols-1 gap-2">
                {product.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 bg-muted/30 border-t border-border/50">
        <Button
          onClick={handleGenerateScript}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25 transition-all duration-300 transform hover:scale-[1.01]"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Ad Script
        </Button>
      </CardFooter>
    </Card>
  );
}