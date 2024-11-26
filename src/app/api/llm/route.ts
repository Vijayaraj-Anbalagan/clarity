import { NextRequest, NextResponse } from 'next/server';
import { runLLM } from '@/utils/llm'; // Adjust the import path as needed.

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required.' },
        { status: 400 }
      );
    }

    const response = await runLLM(prompt);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in LLM route:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request.' },
      { status: 500 }
    );
  }
}
