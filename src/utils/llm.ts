import Groq from 'groq-sdk';

const groq = new Groq();

export async function runLLM(userPrompt: string): Promise<string> {
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

    const fullResponse = chatCompletion.choices[0]?.message?.content || '';

    return fullResponse;
  } catch (error) {
    console.error('Error running LLM:', error);
    return 'An error occurred while generating a response.';
  }
}
