import { MongoClient } from 'mongodb';
import { runLLM } from './llm';
import { NextResponse } from 'next/server';

let client: MongoClient;
let isConnected = false;

// MongoDB connection setup
async function dbConnect() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URL || '');
  }
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log('Connected to MongoDB');
  }
  return client.db(process.env.MONGODB_DB);
}

// Generate MongoDB Query
export async function generateMongoQuery(query: string): Promise<any> {
    try {
      const groqPrompt = `
  You are an AI designed to translate natural language queries into MongoDB queries.
  Here is the database schema you will be working with:
  
  Database Schema:
  {
    "collection": "employees",
    "fields": {
      "employee_id": "string",
      "name": "string",
      "email": "string",
      "department": "string",
      "designation": "string",
      "location": "string",
      "contact_number": "string",
      "date_of_joining": "date",
      "current_project": {
        "project_name": "string",
        "role": "string",
        "start_date": "date",
        "description": "string"
      },
      "skills": "array of strings",
      "manager": {
        "name": "string",
        "email": "string",
        "contact_number": "string"
      },
      "linkedin_profile": "string",
      "profile_picture": "string (URL)"
    }
  }
  
  Translate the following natural language query into a valid MongoDB query:
  Query: "${query}"
  I don't need any other information other than the collection and filter that should be in the JSON format as shown below.
  Response format (strictly JSON, no additional text):
  {
    "collection": "string",
    "filter": { ... }
  }`;
  
      const llmResponse = await runLLM(groqPrompt);
  
      // Debugging: Log the raw response from LLM
      console.log('LLM Response:', llmResponse);
  
      // Extract the JSON part from the response
      const jsonMatch = llmResponse.match(/```json([\s\S]*?)```/);
      if (!jsonMatch || jsonMatch.length < 2) {
        throw new Error(
          `Failed to extract JSON from LLM response. Raw response: ${llmResponse}`
        );
      }
  
      let jsonResponse = jsonMatch[1].trim(); // Get the matched JSON content
  
      // Preprocess the JSON to ensure valid syntax
      jsonResponse = jsonResponse
        .replace(/(\$[a-zA-Z0-9_]+)/g, '"$1"') // Quote MongoDB operators like $or, $regex, $elemMatch
        .replace(/""/g, '"'); // Remove any double quotes around keys
  
      // Parse the preprocessed JSON
      try {
        return JSON.parse(jsonResponse);
      } catch (error) {
        throw new Error(
          `Invalid JSON extracted from LLM response. Extracted JSON: ${jsonResponse}. Error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    } catch (error) {
      throw new Error(
        `Error generating MongoDB query: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  
  
  
  
  
// Execute MongoDB Query
export async function executeMongoQuery(query: any): Promise<any> {
    try {
      // Connect to MongoDB
      const db = await dbConnect();
  
      const collection = db.collection(query.collection);
  
      const result = await collection.find(query.filter).toArray();
      return result;
    } catch (error) {
      throw new Error(`Error executing MongoDB query: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  

// Summarize Results
export async function summarizeResults(results: any): Promise<string> {
  try {
    const groqPrompt = `
You are an AI that summarizes MongoDB query results into concise, readable text for end-users.
Here is the database schema you are summarizing from:

Database Schema:
{
  "collection": "employees",
  "fields": {
    "employee_id": "string",
    "name": "string",
    "email": "string",
    "department": "string",
    "designation": "string",
    "location": "string",
    "contact_number": "string",
    "date_of_joining": "date",
    "current_project": {
      "project_name": "string",
      "role": "string",
      "start_date": "date",
      "description": "string"
    },
    "skills": "array of strings",
    "manager": {
      "name": "string",
      "email": "string",
      "contact_number": "string"
    },
    "linkedin_profile": "string",
    "profile_picture": "string (URL)"
  }
}

Summarize the following results:
${JSON.stringify(results)}

Response:
`;
    const llmResponse = await runLLM(groqPrompt);
    return llmResponse;
  } catch (error) {
    throw new Error(`Error summarizing results: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// API Endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Step 1: Generate Query
    const mongoQuery = await generateMongoQuery(body.query);

    // Step 2: Execute MongoDB Query
    const results = await executeMongoQuery(mongoQuery);

    // Step 3: Summarize Results
    const summary = await summarizeResults(results);

    return NextResponse.json({ results, summary }, { status: 200 });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json(
      { error: `Something went wrong: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
