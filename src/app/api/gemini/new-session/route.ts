import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import ChatSessionModel from '../../../../models/chat.model';
import { dbConnect } from '@/config/dbConnect';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId }: { userId: string } = await req.json();

    if (!userId) {
      throw new Error('User ID is required to start a session');
    }

    // Generate a new session ID
    const sessionId = new mongoose.Types.ObjectId().toString();

    // Create a new chat session
    const newChatSession = new ChatSessionModel({
      userId,
      sessionName: 'New Session1',
      sessionId,
      messages: [],
    });

    // Save the session to the database
    await newChatSession.save();

    return NextResponse.json(
      { message: 'New chat session created', sessionId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error starting new session:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to create a new chat session' },
      { status: 500 }
    );
  }
}
