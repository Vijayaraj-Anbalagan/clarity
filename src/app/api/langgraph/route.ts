import { NextRequest, NextResponse } from 'next/server';
import { app } from '@/utils/langgraph';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import mongoose from 'mongoose';
import { dbConnect } from '@/config/dbConnect';
import { cookiesParse } from '@/utils/cookies';
import ChatSessionModel from '@/models/chat.model';
import User from '@/models/user.model';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const user = await cookiesParse(req);
    const { query, history, sessionId } = body;

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

    let chatSession = await ChatSessionModel.findOne({ sessionId });

    if (!chatSession) {
      const newSessionId = new mongoose.Types.ObjectId().toString();
      chatSession = new ChatSessionModel({
        userId: user._id,
        sessionName: 'New Session',
        sessionId: newSessionId,
        messages: [],
      });
      await chatSession.save();
    }

    const formattedHistory: BaseMessage[] = history.map((msg) =>
      msg.role === 'user'
        ? new HumanMessage(msg.message)
        : new AIMessage(msg.message)
    );

    const initialState = {
      messages: [...formattedHistory, new HumanMessage(query)],
    };

    // Start measuring response time
    const startTime = Date.now();

    const output = await app.invoke(initialState, {
      configurable: { thread_id: sessionId },
    });

    // End measuring response time
    const endTime = Date.now();
    const responseTime = endTime - startTime; // Response time in milliseconds

    const responseMessage =
      output.messages[output.messages.length - 1]?.content || '';
    chatSession.messages.push(
      { role: 'user', message: query },
      { role: 'model', message: responseMessage }
    );
    await chatSession.save();

    console.log(`Response time: ${responseTime}ms`);

    const sentimentAnalysis = await axios.post(
      'http://localhost:3000/api/sentimentAnalysis',
      {
        text: query,
      }
    );

    //ToDO: Optimise
    const sentiment = sentimentAnalysis.data.classification;

    console.log('Sentiment', sentiment);
    // Find the user and update using schema methods
    const userRecord = await User.findById(user._id);
    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update metrics using schema methods
    userRecord.updateEngagementMetrics(
      2,
      sentiment.toLowerCase(),
      responseTime
    );
    userRecord.incrementSessions();
    await userRecord.save();

    return NextResponse.json({
      response: responseMessage,
      sessionId: chatSession.sessionId,
      responseTime,
    });
  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
