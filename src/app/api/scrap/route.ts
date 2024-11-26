import { NextResponse } from 'next/server';
import { scrapeWebsite } from '@/utils/scrap';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Please provide a valid URL' },
        { status: 400 }
      );
    }

    await scrapeWebsite(url);
    return NextResponse.json({ message: 'Scraping complete. Data saved.' });
  } catch (error: any) {
    console.error('Scraping failed:', error);
    return NextResponse.json(
      { error: 'Scraping failed', details: error.message },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs'; // Ensure Puppeteer runs on Node.js runtime
