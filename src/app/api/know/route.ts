import { NextResponse } from 'next/server';
import { generateMongoQuery, executeMongoQuery, summarizeResults } from '@/utils/know';

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();

    if (!body || !body.query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const query = body.query;

    // Step 1: Generate MongoDB query
    let mongoQuery;
    try {
      mongoQuery = await generateMongoQuery(query);
    } catch (error) {
      console.error('Error generating MongoDB query:', error);
      return NextResponse.json(
        { error: `Failed to generate MongoDB query: ${(error as Error).message}` },
        { status: 500 }
      );
    }

    // Step 2: Execute MongoDB query
    let results;
    try {
      results = await executeMongoQuery(mongoQuery);
    } catch (error) {
      console.error('Error executing MongoDB query:', error);
      return NextResponse.json(
        { error: `Failed to execute MongoDB query: ${(error as Error).message}` },
        { status: 500 }
      );
    }

    // Step 3: Summarize results
    let summarizedResponse;
    try {
      summarizedResponse = await summarizeResults(results);
    } catch (error) {
      console.error('Error summarizing results:', error);
      return NextResponse.json(
        { error: `Failed to summarize results: ${(error as Error).message}` },
        { status: 500 }
      );
    }

    // Return the final response
    return NextResponse.json(
      {
        success: true,
        rawResults: results,
        summary: summarizedResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: `Unexpected error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
