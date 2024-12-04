import {
  BaseMessage,
  AIMessage,
  HumanMessage,
  MessageContent,
} from '@langchain/core/messages';
import { StateGraph } from '@langchain/langgraph';
import { MemorySaver, Annotation } from '@langchain/langgraph';
import Groq from 'groq-sdk';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions.mjs';

// Initialize Groq
const groq = new Groq();

// Define the state for LangGraph
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

// Function to perform a RAG workflow
async function performRAG(userPrompt: string): Promise<string> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `
You are Clarity, an intelligent enterprise assistant chatbot designed for organizational use.
Your primary role is to provide precise, professional, and actionable responses to user queries related to HR policies, IT support, company events, and legal information.

Guidelines:
1. Base all responses exclusively on the retrieved context provided below.
2. Do not include any information or assumptions not explicitly mentioned in the context.
3. If the requested information is unavailable in the provided context, respond politely with:
   "I'm sorry, I could not find the information you are looking for in the provided context. Please reach out to the appropriate department for further assistance."
4. Maintain a formal, professional, and concise tone.
5. Avoid embellishments, unnecessary framing, or speculative details.
6. Begin directly with actionable information, avoiding phrases like "Based on the context provided" or "The procedure is as follows."
          `,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: 'llama-3.2-1b-preview',
      temperature: 0.55,
      max_tokens: 8192,
      top_p: 0.88,
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

// Function to perform a direct LLM call
async function performLLM(
  userPrompt: string,
  history: Array<AIMessage | HumanMessage>
): Promise<string> {
  try {
    // Format the history messages
    const formattedHistory: Array<{
      role: string;
      content: string;
      name?: string;
    }> = history.slice(-5).map((msg) => {
      if (msg instanceof HumanMessage) {
        return { role: 'user', content: String(msg.content) };
      } else if (msg instanceof AIMessage) {
        return { role: 'assistant', content: String(msg.content) };
      }
      throw new Error('Invalid message type in history');
    });

    // Add the user prompt as the latest message
    formattedHistory.push({ role: 'user', content: userPrompt, name: '' });

    formattedHistory.forEach((message) => {
      if (message.role === 'function' && !message.name) {
        throw new Error(`The "name" property is required for role "function"`);
      }
    });

    // Perform the chat completion API call with the full history
    const chatCompletion = await groq.chat.completions.create({
      messages: formattedHistory as ChatCompletionMessageParam[], // Use the formatted history along with the user prompt
      model: 'llama-3.2-1b-preview',
      temperature: 0.7,
      max_tokens: 8192,
      top_p: 0.9,
      stream: false,
      stop: null,
    });

    // Extract and return the chatbot response
    const response = chatCompletion.choices[0]?.message?.content || '';
    return response;
  } catch (error) {
    console.error('Error running LLM:', error);
    return 'An error occurred while generating a response.';
  }
}

// Router function to determine if RAG or LLM is needed
function router(state: typeof StateAnnotation.State) {
  const query = String(
    state.messages[state.messages.length - 1]?.content || ''
  );
  console.log('Query:', query);

  if (
    query.toLowerCase().includes('hr') ||
    query.toLowerCase().includes('policy') ||
    query.toLowerCase().includes('event') ||
    query.toLowerCase().includes('it support') ||
    query.toLowerCase().includes('legal')
  ) {
    console.log('Routing to RAG');
    return 'RAG';
  }
  console.log('Routing to LLM');
  return 'LLM';
}

// Workflow nodes
async function callRAG(state: typeof StateAnnotation.State) {
  const query = String(
    state.messages[state.messages.length - 1]?.content || ''
  );
  const response = await performRAG(query);
  state.messages.push(new AIMessage(response));
  return state;
}

async function callLLM(state: typeof StateAnnotation.State) {
  const query = String(
    state.messages[state.messages.length - 1]?.content || ''
  );
  state.messages.pop();
  const response = await performLLM(query, state.messages);
  state.messages.push(new AIMessage(response));
  return state;
}

// Define the graph
const workflow = new StateGraph(StateAnnotation)
  .addNode('RAG', callRAG)
  .addNode('LLM', callLLM)
  .addEdge('__start__', 'LLM')
  .addConditionalEdges('LLM', router, {
    RAG: 'RAG',
    LLM: '__end__',
  })
  .addEdge('RAG', '__end__');

// Initialize memory to persist state
const checkpointer = new MemorySaver();

// Compile the workflow into a Runnable
export const app = workflow.compile({ checkpointer });
