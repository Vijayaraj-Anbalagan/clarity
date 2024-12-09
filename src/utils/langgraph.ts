import { BaseMessage, AIMessage, HumanMessage } from '@langchain/core/messages';
import { StateGraph } from '@langchain/langgraph';
import { MemorySaver, Annotation } from '@langchain/langgraph';
import Groq from 'groq-sdk';
import { io } from 'socket.io-client';

// Initialize Groq
const groq = new Groq();
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to the server.');
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server.');
});
// Define the state for LangGraph
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

// Function to perform a RAG workflow
async function performRAG(userPrompt: string): Promise<string> {
  console.log('Query form socket', userPrompt);
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
async function performLLM(userPrompt: string): Promise<string> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: 'llama-3.2-1b-preview',
      temperature: 0.7,
      max_tokens: 8192,
      top_p: 0.9,
      stream: false,
      stop: null,
    });

    const response = chatCompletion.choices[0]?.message?.content || '';
    return response;
  } catch (error) {
    console.error('Error running LLM:', error);
    return 'An error occurred while generating a response.';
  }
}

// Router function to determine if RAG or LLM is needed using LLM call
async function router(state: typeof StateAnnotation.State): Promise<string> {
  const query = String(
    state.messages[state.messages.length - 1]?.content || ''
  );
  console.log('Query', query);

  try {
    const classificationPrompt = `
      User query: "${query}"
      Your task is to classify the given user query into one of the following categories if query related to organizational matters such as anything related to organizational matters : [Organisation, Not Related to Organisation].
      If you find the query is not related to organisational matters but also partially related to organisational matters , please classify it as 'Organisation'.
      Please remember that 'Organistional matters' meaning anything related to HR policies, IT support, company events, and legal information and not about general or public information.
      Only respond with the category name and the reason for opting that category as the following format of json.
      {
        "category": "Category_name",
        "reason": "The reason for opting that category."
      }

       Examples of 'Organisation' queries:
      - "What is the privacy policy of our company?"
      - "How do I access the HR portal?"
      - "Tell me about the upcoming company event."
      - "What are the IT support hours?"
      - "What is the process for submitting a leave request?"
      - "How do I report a security incident?"
      - "What is the procedure for booking a conference room?"
      - "How do I access the company handbook?"
      
      Examples of 'Not Related to Organisation' queries:
      - "What is the weather today?"
      - "Tell me a joke."
      - "What is the capital of France?"
      - "What is the latest movie in theaters?"
      - "What is the best restaurant in town?"
    `;

    const classificationResponse = await performLLM(classificationPrompt);
    console.log('Classification Response:', classificationResponse);

    const classificationResult = JSON.parse(classificationResponse);
    if (classificationResult.category.trim().toLowerCase() === 'organisation') {
      console.log('Routing to RAG');
      return 'RAG';
    }
  } catch (error) {
    console.error('Error in router classification:', error);
  }

  console.log('Routing to LLM');
  return 'LLM';
}

// Workflow nodes
async function callRAG(state: typeof StateAnnotation.State) {
  console.log('callRAG');

  let response = '';
  let queryResponse = '';

  // Emit classification flag to the backend
  socket.emit('classificationFlag', { flag: true });

  try {
    // Wait for the backend to emit queryResponse
    queryResponse = await new Promise((resolve, reject) => {
      socket.once('queryResponse', (data) => {
        console.log('Received queryResponse from backend:', data.response);
        resolve(data.response); // Resolve with the backend response
      });

      // Optional timeout to avoid indefinite waiting
      // setTimeout(() => reject(new Error('QueryResponse timeout')), 10000); // 10 seconds
    });

    // Perform RAG using the received query response
    if (queryResponse) {
      response = await performRAG(queryResponse);
    }

    console.log('Final Response in Frontend:', response);

    // Update state with the AI response
    state.messages.push(new AIMessage(response));
  } catch (error: any) {
    console.error('Error in callRAG:', error.message);
  }

  return state;
}

async function callLLM(state: typeof StateAnnotation.State) {
  const query = String(
    state.messages[state.messages.length - 1]?.content || ''
  );
  const response = await performLLM(query);
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
