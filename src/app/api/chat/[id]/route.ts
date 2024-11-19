import { NextResponse } from 'next/server';
import ChatSessionModel from '../../../../models/chat.model'; // Import the model

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId'); // Optionally filter by userId

    let sessions;
    if (userId) {
      // Fetch sessions for a specific user
      sessions = await ChatSessionModel.find({ userId }).lean();
    } else {
      // Fetch all chat sessions
      sessions = await ChatSessionModel.find().lean();
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
