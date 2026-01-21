import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Sparkles, ArrowRight } from 'lucide-react';

export function UrlInputForm() {
  const [url, setUrl] = useState('');
  const { setLoading, setError, setProduct, setStep } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape product data');
      }

      const product = await response.json();
      setProduct(product);
      setStep('product');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-primary/10 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-xl">
      <CardHeader className="text-center space-y-2 pb-8">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">Start Generating</CardTitle>
        <CardDescription className="text-lg">
          Paste your product link below. We support Amazon & Shopify.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <Input
              type="url"
              placeholder="https://www.amazon.com/dp/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="relative w-full h-14 pl-6 text-lg bg-background border-border/50 focus:border-primary/50 transition-all rounded-lg"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25 transition-all duration-300 transform hover:scale-[1.01]"
          >
            Generate Video Ad <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}