import { NextResponse } from 'next/server';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { GoogleGenerativeAI } from '@google/generative-ai';

const enhanceScriptWithGemini = async (baseScript: string, product: any) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return baseScript; // Fallback to base script if no key

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Rewrite the following video ad script to be more cinematic, high-energy, and premium.
        Focus on visual descriptions that imply dynamic motion and premium quality.
        Keep the structure compatible with: "VISUAL: [Description] VO: [Voiceover]"
        
        Product: ${product.title}
        Original Script:
        ${baseScript}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (e) {
        console.error("Gemini Enhancement Failed", e);
        return baseScript;
    }
};

export async function POST(request: Request) {
    try {
        const { script, format, product, videoMode } = await request.json();

        console.log(`Rendering video in ${videoMode} mode for ${format} format`);

        if (!script) {
            return NextResponse.json(
                { error: 'Script is required' },
                { status: 400 }
            );
        }

        let finalScript = script;
        const isAdvanced = videoMode === 'ai';

        if (isAdvanced) {
            console.log("Enhancing script with Gemini for AI Video Mode...");
            // In a real "Gemini Video" scenario, we might call a video generation endpoint here.
            // Since we are simulating "API based video" via our advanced renderer:
            finalScript = await enhanceScriptWithGemini(script, product);
        }

        const width = format === 'landscape' ? 1920 : 1080;
        const height = format === 'landscape' ? 1080 : 1920;
        const compositionId = 'AdVideo';

        // 1. Bundle the video code
        const entryPoint = path.join(process.cwd(), 'src', 'remotion', 'index.tsx');

        // Check if bundle already exists to save time? Remotion bundler handles caching usually.
        // But for development we just bundle.
        const bundled = await bundle({
            entryPoint,
            // If we are in Webpack mode (Next.js), we might need extra config, 
            // but Remotion default bundler usually handles standard TS/React.
        });

        console.log('Rendering...');
        const outputFilename = `ad-${format}-${isAdvanced ? 'ai' : 'std'}-${Date.now()}.mp4`;
        const downloadsDir = path.join(process.cwd(), 'public', 'videos');
        // Using public/videos for direct access if needed, or I can just stream it.
        // User wants "Download".
        // Better to save to `public/videos` providing a URL, AND allowing separate download.
        // BUT user complained about 404. 
        // So I will render to `public/videos` and return that URL.

        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir, { recursive: true });
        }

        const outputPath = path.join(downloadsDir, outputFilename);

        const inputProps = {
            script: finalScript,
            product,
            isAdvanced
        };

        const composition = await selectComposition({
            serveUrl: bundled,
            id: compositionId,
            inputProps,
        });

        // Patch the composition with required VideoConfig properties
        const compositionsWithConfig = {
            ...composition,
            width,
            height,
            fps: 30,
            durationInFrames: 450,
            props: inputProps,
            defaultCodec: 'h264' as const,
        };

        await renderMedia({
            composition: compositionsWithConfig,
            serveUrl: bundled,
            codec: 'h264',
            outputLocation: outputPath,
            inputProps
        });

        return NextResponse.json({
            videoUrl: `/videos/${outputFilename}`,
            success: true,
            isAdvanced
        });

    } catch (error) {
        console.error('Render error:', error);
        return NextResponse.json(
            { error: 'Failed to render video' },
            { status: 500 }
        );
    }
}
