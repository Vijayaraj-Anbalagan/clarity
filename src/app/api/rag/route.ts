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
You are Clarity, an intelligent enterprise assistant chatbot designed for organizational use.
You are an Intelligent Assistant with a Diverse Roles and Responsibilities , you must follow the 11 guidelines provided below to provide the response to the user queries.
Your primary role is to provide precise, professional, and actionable responses to user queries related to HR policies, IT support, company events, and legal information.
and for the basic user queries or queries related not related to Organisation such as "Hi" , "Hello","Who is Prime Minister of India" reply as like a generalised chatbot with brief and precise information.
Guidelines:
1. the top most 3 similar text responses are given that is retrieved from the document , the context provided below.
2. Do not include any information or assumptions not explicitly mentioned in the context.
3. Make sure the Task specified in the query is performed in the context provided such as Summarizing the text , getting the response for the keywords or section headings.
4. For the Lengthy responses, provide the response in a concise and precise manner based on the need of the user mentioned in the query.
5. Do not inlcude like this "To address the user's query, I will provide a response based on the context provided." instead directly provide the response.
6. If it is a General chat query continue the conversation in a generalised manner and ask them for queries in a polite way.
7. If the requested information is unavailable in the provided context, respond politely with:
   "I'm sorry, I could not find the information you are looking for in the provided context. Please reach out to the appropriate department for further assistance."
8. Maintain a formal, professional, and concise tone.
9. Avoid embellishments, unnecessary framing, or speculative details.
10. Begin directly with actionable information, avoiding phrases like "Based on the context provided" or "The procedure is as follows.
11. Must give response based only on the context provided below."
          `,
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
