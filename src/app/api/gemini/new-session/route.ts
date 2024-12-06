import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import ChatSessionModel from '../../../../models/chat.model';
import { dbConnect } from '@/config/dbConnect';
import { cookiesParse } from '@/utils/cookies';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await cookiesParse(req);

    if (!user?._id) {
      throw new Error('User ID is required to start a session');
    }

    // Generate a new session ID
    const sessionId = new mongoose.Types.ObjectId().toString();

    // Create a new chat session
    const newChatSession = new ChatSessionModel({
      userId: user._id,
      sessionName: 'New Session 1',
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
