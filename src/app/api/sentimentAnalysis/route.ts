// app/api/mood-prediction/route.ts
import { NextRequest, NextResponse } from 'next/server';

import fetch from 'node-fetch';

// TypeScript types
interface SentimentResult {
  label: string;
  score: number;
}

interface HuggingFaceResponse {
  [key: number]: SentimentResult[];
}

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY as string;
console.log('API', HUGGING_FACE_API_KEY);
const HUGGING_FACE_MODEL =
  'https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment'; // Example model

// Simplified sentiment classification mapping
const sentimentMapping: Record<string, 'Positive' | 'Negative' | 'Neutral'> = {
  '1 star': 'Negative',
  '2 stars': 'Negative',
  '3 stars': 'Neutral',
  '4 stars': 'Positive',
  '5 stars': 'Positive',
};

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    console.log('Textttttt', text);
    // Ensure the input text is a string
    if (typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json(
        { error: 'Text input must be a non-empty string' },
        { status: 400 }
      );
    }

    console.log('Text:', text);

    // Call Hugging Face API for sentiment analysis
    const response = await fetch(HUGGING_FACE_MODEL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    });

    // Check the response status and log any errors
    if (!response.ok) {
      const errorDetail = await response.text();
      console.error('Hugging Face API error details:', errorDetail);
      throw new Error(
        `Hugging Face API request failed with status ${response.status}`
      );
    }

    const result: HuggingFaceResponse = await response.json();

    // Extract the highest score and its corresponding label
    const highestScore = result[0]?.reduce<SentimentResult>(
      (max, item) => (item.score > max.score ? item : max),
      { label: 'Neutral', score: -Infinity }
    );
    const sentimentLabel = highestScore?.label || '3 stars';

    // Simplify the sentiment classification
    const classification = sentimentMapping[sentimentLabel] || 'Neutral';

    return NextResponse.json({ classification }, { status: 200 });
  } catch (error) {
    console.error('Error in mood prediction:', error);
    return NextResponse.json(
      { error: 'Mood prediction failed' },
      { status: 500 }
    );
  }
}
