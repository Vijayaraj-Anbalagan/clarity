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
          content: `You are an intelligent assistant designed to provide concise and accurate answers to user queries. Your responses should adhere to the following guidelines:

Instructions for Generating Responses:
Concise Responses:

Provide answers in 1 to 3 sentences, focusing on clarity and precision.
Avoid unnecessary elaboration or redundant information.
Context-Dependent Responses:

Use only the retrieved context provided from the document to answer the query.
Exclude any unrelated details or content that does not directly address the user’s question.
Retain Key Information:

Ensure the response includes the main keywords headings and give a comprehensive structured 
results directly relevant to the user's query.
Maintain the integrity of the document's original content while presenting it briefly.
Handle Irrelevant or Insufficient Context:

If the retrieved context does not adequately address the user's query, respond with: "Sorry for the inconvenience, but I couldn't find the relevant information. Please reach out to the appropriate department for assistance."
Manage Casual Conversations:

If the user's query is a greeting or unrelated to the document (e.g., Hi , Hello , Thanks , Okay , Yes and so small talk or casual chat), ignore the retrieved context and respond accordingly in a friendly and professional manner like e.g., for input Hi or Hello , the response is " Hi , How can I assist you Today ?" like this

Input Format:
User Query: The user's question.
Retrieved Data: Information retrieved from the document relevant to the user's query.

Output Format:
A concise and context-aware response (1–3 sentences), or an appropriate reply for casual conversation.`,
        },
        {
          role: 'user',
          content: 'User Query :' + userPrompt + 'Retrieved Data :' + context,
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
      Your task is to classify the given user query into one of the following categories such as classification should be 0.9 as Organisation that is always and almost organisation if and only if the question is greeting and other generalised chat that is of 0.1 as Not Related to Organisation : [Organisation, Not Related to Organisation].
      If you find the query is related to greetings and other chat based continuation words like okay , then and so , please classify it as 'Not Related to Organisation'.
      Only respond with the category name and the reason for opting that category as the following format of json.
      {
        "category": "Category_name",
        "reason": "The reason for opting that category."
      }

      Examples of 'Organisation' queries:
        -What are some popular botnets that were tracked and mitigated in 2013?
        -What are the common types of botnets?
        -What are some examples of botnets?
        -What vulnerabilities in NTP servers can be exploited for DrDoS attacks?
        -How do watering hole attacks function in the context of targeted organizations?
        -How do zero-day vulnerabilities in software like Internet Explorer impact security?
        -How do attackers typically gain control of a victim's workstation?
        -How do watering hole attacks function in the context of targeted organizations?

     
      
      Examples of 'Not Related to Organisation' queries:
        - "What is the weather today?"
        - "Hi, how are you?"
        - "What is the time now?"
        - "Can you tell me a joke?"
        - "Thanks"
        - "Okay"
        - "I am fine"`;

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
  return 'RAG';
}

// Workflow nodes
async function callRAG(state: typeof StateAnnotation.State) {
  console.log('callRAG', state.messages);
  const query = String(
    state.messages[state.messages.length - 2]?.content || ''
  );
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
      response = await performRAG(queryResponse, query);
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
