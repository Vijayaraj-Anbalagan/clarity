'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChat = async () => {
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(data.response || 'No response received.');
      } else {
        setResponse(data.error || 'An error occurred while processing your request.');
      }
    } catch (error) {
      setResponse('An unexpected error occurred.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Chat with Clarity</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
        style={{ width: '100%', height: '100px', marginBottom: '10px' }}
      />
      <button onClick={handleChat} disabled={loading}>
        {loading ? 'Loading...' : 'Get Response'}
      </button>
      {response && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
