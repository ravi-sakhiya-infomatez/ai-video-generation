import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Product } from '@/types/product';

const generateScriptWithOpenAI = async (prompt: string) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API Key is missing. Please add OPENAI_API_KEY to your .env file.");
  }
  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a professional advertising copywriter specializing in video ad scripts."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });
  return completion.choices[0].message.content;
}

const generateScriptWithGemini = async (prompt: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(`You are a professional advertising copywriter specializing in video ad scripts. ${prompt}`);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini Details:", error);
    if (error.message?.includes("API key not valid")) {
      throw new Error("Invalid or missing Google Gemini API Key. Please check your .env file.");
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { product } = await request.json();

    if (!product) {
      return NextResponse.json(
        { error: 'Product data is required' },
        { status: 400 }
      );
    }

    // Validate product data
    if (!product.title || !product.description) {
      return NextResponse.json(
        { error: 'Product must have a title and description' },
        { status: 400 }
      );
    }

    // Create a prompt for the ad script
    const prompt = `Create a compelling 30-second video ad script for the following product:

Product: ${product.title}
Price: ${product.price || 'Not specified'}
Description: ${product.description}
Key Features:
${product.features.map((feature: string) => `- ${feature}`).join('\n')}

Format the script with clear VISUAL and VO (Voice Over) sections for each scene.
Each scene should be 5-10 seconds.
Use this format:

VISUAL: [Describe what appears on screen]
VO: [Voice over script]

[Next scene...]

Make it engaging, professional, and highlight the product's key benefits.`;

    let script: string | null = null;
    // Default to Gemini if AI_PROVIDER is not set or set to 'gemini'
    const provider = process.env.AI_PROVIDER || 'gemini';

    console.log(`Using AI Provider: ${provider}`);

    if (provider === 'openai') {
      script = await generateScriptWithOpenAI(prompt);
    } else {
      // Default to Gemini
      script = await generateScriptWithGemini(prompt);
    }

    if (!script) {
      throw new Error('Failed to generate script');
    }

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Script generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate script' },
      { status: 500 }
    );
  }
}