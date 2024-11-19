import { NextResponse } from 'next/server';
import ChatSessionModel from '../../../../models/chat.model'; // Import the model

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId'); // Optionally filter by userId

    let sessions;
    if (userId) {
      sessions = await ChatSessionModel.find({ userId }).lean();
    } else {
      return NextResponse.json(
        { error: 'User ID is required to fetch chat sessions' },
        { status: 400 }
      );
    }

    if (!sessions || sessions.length === 0) {
      return NextResponse.json(
        { message: 'No chat sessions found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching chat sessions:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch chat sessions' },
      { status: 500 }
    );
  }
}
