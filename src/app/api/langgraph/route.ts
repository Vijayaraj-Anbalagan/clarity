import { NextRequest, NextResponse } from "next/server";
import { app } from '@/utils/langgraph';
import { HumanMessage } from "@langchain/core/messages";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Generate a unique thread ID (e.g., using a timestamp or UUID)
    const threadId = Date.now().toString();

    // Create the initial state
    const initialState = { messages: [new HumanMessage(query)] };

    // Invoke the workflow with the thread ID
    const output = await app.invoke(initialState, {
      configurable: { thread_id: threadId },
    });

    const responseMessage = output.messages[output.messages.length - 1]?.content || "";

    return NextResponse.json({ response: responseMessage });
  } catch (error) {
    console.error("Error processing query:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
