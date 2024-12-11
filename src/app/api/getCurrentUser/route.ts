import { cookiesParse } from '@/utils/cookies';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const userId = await cookiesParse(req);
  console.log('Api', userId);
  try {
    if (!userId) {
      return {
        status: 401,
        json: {
          message: 'Unauthorized',
        },
      };
    }

    return NextResponse.json({ userId: userId._id });
  } catch (error) {
    return {
      status: 500,
      json: {
        message: 'Server Error',
      },
    };
  }
}
