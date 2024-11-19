import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
import ChatSessionModel from '../../../../models/chat.model'; // Import the model
import axios from 'axios';

const apiKey: string | undefined = process.env.GEMINI_API_KEY;

interface RequestBody {
  prompt: string;
  history: { role: 'user' | 'model'; message: string }[];
  sessionId: string;
  userId: string;
}

export async function POST(req: Request) {
  try {
    const { prompt, history, sessionId, userId }: RequestBody =
      await req.json();

    if (!apiKey) {
      throw new Error('API key is not defined');
    }

    // Check if session exists
    const chatSession = await ChatSessionModel.findOne({ userId, sessionId });
    if (!chatSession) {
      throw new Error('Session not found');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const modelPrompt = `Give appropriate response to the following prompt: ${prompt}`;
    const updatedHistory = history.map((item) => ({
      role: item.role,
      parts: [{ text: item.message }],
    }));

    const generationConfig: GenerationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    };

    const modelSession = await model.startChat({
      generationConfig,
      history: updatedHistory,
    });

    const result = await modelSession.sendMessage(modelPrompt);
    const botResponse: string =
      JSON.parse(result?.response?.text()).response ||
      "Sorry, I couldn't generate a response.";

    chatSession.messages.push(
      { role: 'user', message: prompt },
      {
        role: 'model',
        message: botResponse,
      }
    );

    await chatSession.save();

    return NextResponse.json(
      { response: botResponse, sessionId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing chat:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
