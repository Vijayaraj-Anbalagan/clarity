import { NextRequest, NextResponse } from 'next/server';
import { ChromaClient } from 'chromadb';
import Groq from 'groq-sdk';
import { dbConnect } from '@/config/dbConnect';
import { cookiesParse } from '@/utils/cookies';
import ChatSession from '@/models/chat.model';
import mongoose from 'mongoose';
import User from '@/models/user.model';
import axios from 'axios';
const groq = new Groq();

async function performRAG(
  context: string,
  userPrompt: string
): Promise<string> {
  console.log('Query form socket', userPrompt);
  console.log('Wuery', context);
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `
You are an intelligent AI assistant specialized in analyzing and responding to queries about cyber security crisis management based on the provided document.

Core Capabilities:
1. Understand and interpret the document's content comprehensively
2. Provide precise, professional, and context-specific responses
3. Handle both technical and general queries with appropriate depth

Key Operational Guidelines:
1. Always prioritize accuracy and relevance to the document's content
2. Respond naturally to greetings and general queries
3. Adapt response style to the specific user query
4. If information is not in the document, clearly state that
5. Avoid unnecessary prefatory phrases or rigid formatting

Document Context Handling:
- For specific queries, extract and present relevant information directly
- For summary requests, provide a concise overview of key points
- For technical queries, offer detailed explanations based on document content
- For general queries, respond appropriately while referencing document if possible

Interaction Principles:
- Be conversational yet professional
- Show understanding of the document's nuanced content
- Demonstrate ability to break down complex information
- Provide actionable and clear responses

Special Instructions for Different Query Types:
- Technical Queries: Provide specific, detailed information
- General Queries: Offer brief, informative responses
- Complex Queries: Break down information systematically
- Summary Requests: Condense key points effectively

Error Handling:
- If query cannot be answered from document, clearly communicate limitations
- Suggest alternative ways to find the required information
- Never fabricate or guess information not present in the document `,
        },
        {
          role: 'user',
          content: "Answer the following query of the user : with respect to the context provided follow the system and the guidelines that are mentioned in it and do answer this "+userPrompt+"from The Context Extracted from the Pdf :"+context,
        },
      ],
      model: 'llama-3.2-1b-preview',
      temperature: 0.2,
      max_tokens: 8192,
      top_p: 0.58,
      stream: false,
      stop: null,
    });

    const response = chatCompletion.choices[0]?.message?.content || '';
    return response;
  } catch (error) {
    console.error('Error performing RAG:', error);
    return 'An error occurred while generating a response.';
  }
}



export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const user = await cookiesParse(request);
    const { query, history, sessionId } = await request.json();
    console.log(query);
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
    }

    if (
      !Array.isArray(history) ||
      !history.every((msg) => msg && typeof msg === 'object')
    ) {
      return NextResponse.json(
        { error: 'Invalid history format' },
        { status: 400 }
      );
    }

    let chatSession = await ChatSession.findOne({ sessionId });

    if (!chatSession) {
      const newSessionId = new mongoose.Types.ObjectId().toString();
      chatSession = new ChatSession({
        userId: user._id,
        sessionName: 'New Session',
        sessionId: newSessionId,
        messages: [],
      });
      await chatSession.save();
    }
    const startTime = Date.now();
    const contextFetch = await axios.post(
      'https://80a7-117-96-40-60.ngrok-free.app/query',
      {
        query,
      }
    );

    const context = contextFetch.data.response;

    const botResponse = await performRAG(context, query);

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log('Bot Response', botResponse);
    const sentiment = 'positive';
    console.log('Sentiment', sentiment);
    // Find the user and update using schema methods
    const userRecord = await User.findById(user._id);
    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    userRecord.updateEngagementMetrics(2, sentiment, responseTime);
    userRecord.incrementSessions();
    await userRecord.save();

    return NextResponse.json({
      response: botResponse,
      sessionId: chatSession.sessionId,
      responseTime,
    });
  } catch (error: any) {
    console.error('Error fetching stored data:', error.message);
    return NextResponse.json(
      { message: 'Error fetching data' },
      { status: 500 }
    );
  }
}
