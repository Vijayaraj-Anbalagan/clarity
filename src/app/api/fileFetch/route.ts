import { NextRequest, NextResponse } from 'next/server';
import { cookiesParse } from '@/utils/cookies';
import File from '@/models/files';

export async function GET(req: NextRequest) {
  const user = await cookiesParse(req);
  const userId = user._id;

  if (!userId) {
    return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
  }

  try {
    // Replace this with your actual database fetching logic
    const document = await File.findOne({ user: userId });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ document: document.files });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
