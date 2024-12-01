import { BaseMessage, AIMessage, HumanMessage } from "@langchain/core/messages";
import { StateGraph } from "@langchain/langgraph";
import { MemorySaver, Annotation } from "@langchain/langgraph";
import Groq from "groq-sdk";

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
          role: "system",
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
          role: "user",
          content: userPrompt,
        },
      ],
      model: "llama-3.2-1b-preview",
      temperature: 0.55,
      max_tokens: 8192,
      top_p: 0.88,
      stream: false,
      stop: null,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";
    return response;
  } catch (error) {
    console.error("Error performing RAG:", error);
    return "An error occurred while generating a response.";
  }
}

// Function to perform a direct LLM call
async function performLLM(userPrompt: string): Promise<string> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      model: "llama-3.2-1b-preview",
      temperature: 0.7,
      max_tokens: 8192,
      top_p: 0.9,
      stream: false,
      stop: null,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";
    return response;
  } catch (error) {
    console.error("Error running LLM:", error);
    return "An error occurred while generating a response.";
  }
}

// Router function to determine if RAG or LLM is needed
function router(state: typeof StateAnnotation.State) {
  const query = String(state.messages[state.messages.length - 1]?.content || "");
  console.log("Query:", query);

  if (
    query.toLowerCase().includes("hr") ||
    query.toLowerCase().includes("policy") ||
    query.toLowerCase().includes("event") ||
    query.toLowerCase().includes("it support") ||
    query.toLowerCase().includes("legal")
  ) {
    console.log("Routing to RAG");
    return "RAG";
  }
  console.log("Routing to LLM");
  return "LLM";
}

// Workflow nodes
async function callRAG(state: typeof StateAnnotation.State) {
  const query = String(state.messages[state.messages.length - 1]?.content || "");
  const response = await performRAG(query);
  state.messages.push(new AIMessage(response));
  return state;
}

async function callLLM(state: typeof StateAnnotation.State) {
  const query = String(state.messages[state.messages.length - 1]?.content || "");
  const response = await performLLM(query);
  state.messages.push(new AIMessage(response));
  return state;
}

// Define the graph
const workflow = new StateGraph(StateAnnotation)
  .addNode("RAG", callRAG)
  .addNode("LLM", callLLM)
  .addEdge("__start__", "LLM")
  .addConditionalEdges("LLM", router, {
    RAG: "RAG",
    LLM: "__end__",
  })
  .addEdge("RAG", "__end__");

// Initialize memory to persist state
const checkpointer = new MemorySaver();

// Compile the workflow into a Runnable
export const app = workflow.compile({ checkpointer });
