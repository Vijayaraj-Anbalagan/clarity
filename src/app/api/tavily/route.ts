import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';


const TAVILY_API_URL = 'https://api.tavily.com/search';
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

export async function POST(req: NextRequest) {
  try {
    
    const body = await req.json();
    const { query } = body;

    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
    }

   
    const tavilyPayload = {
      query, // The search query string
      api_key: TAVILY_API_KEY, // API Key for authentication
      search_depth: 'basic',
      max_results: 5,
    };

    // Make a POST request to Tavily API with the query payload
    const tavilyResponse = await axios.post(TAVILY_API_URL, tavilyPayload, {
      headers: {
        Authorization: `Bearer ${TAVILY_API_KEY}`, // API Key for authentication
        'Content-Type': 'application/json', // Specify JSON content type
      },
    });

    // Extract and process the API response data
    const scrapedData = tavilyResponse.data;

    // Format the response for the frontend
    const formattedResponse = {
      status: 'success',
      data: scrapedData.results, // Use appropriate field from Tavily response (e.g., 'results' or 'data')
      meta: {
        responseTime: scrapedData.response_time, // Include additional metadata like response time
      },
    };

    // Send the structured response to the frontend
    return NextResponse.json(formattedResponse);
  } catch (error: any) {
    // Log the error for debugging purposes
    console.error('Error interacting with Tavily AI:', error);

    // Respond with an appropriate error message
    return NextResponse.json(
      {
        error: 'Failed to fetch data from Tavily AI',
        details: error.response?.data || error.message, // Provide detailed error info if available
      },
      { status: 500 }
    );
  }
}
