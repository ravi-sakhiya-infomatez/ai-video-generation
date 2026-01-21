import { create } from 'zustand';
import { AppState, Product } from '@/types/product';

type Step = 'url' | 'product' | 'script' | 'selection' | 'video';
type VideoMode = 'remotion' | 'ai';

const initialState: AppState & { videoMode: VideoMode } = {
  step: 'url' as Step,
  product: null,
  script: null,
  videoUrl: null,
  videoMode: 'remotion',
  isLoading: false,
  error: null,
};

export const useStore = create<AppState & {
  videoMode: VideoMode;
  setStep: (step: Step) => void;
  setProduct: (product: Product) => void;
  setScript: (script: string) => void;
  setVideoMode: (mode: VideoMode) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setProduct: (product) => set({ product }),
  setScript: (script) => set({ script }),
  setVideoMode: (videoMode) => set({ videoMode }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));