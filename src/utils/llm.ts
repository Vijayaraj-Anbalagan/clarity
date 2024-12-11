import Groq from 'groq-sdk';

const groq = new Groq();

export async function runLLM(userPrompt: string): Promise<string> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: ``,
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
