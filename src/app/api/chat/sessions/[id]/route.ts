import { NextResponse } from 'next/server';
import ChatSessionModel from '../../../../../models/chat.model';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: sessionId } = params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Find the chat session by its ID
    const session = await ChatSessionModel.findOne({ sessionId }).lean();

    if (!session) {
      return NextResponse.json(
        { message: 'Chat session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(session, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching chat session:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch chat session' },
      { status: 500 }
    );
  }
}
