"use client";

import { useState } from 'react';

export default function KnowPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/know', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data.result || 'No response available');
    } catch (error) {
      setResponse('Error processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Employee Information</h1>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query in natural language..."
        style={{
          width: '100%',
          height: '100px',
          marginBottom: '20px',
          padding: '10px',
          fontSize: '16px',
        }}
      />
      <button
        onClick={handleQuerySubmit}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Loading...' : 'Submit Query'}
      </button>
      <div style={{ marginTop: '20px' }}>
        <h3>Response:</h3>
        <pre
          style={{
            background: '#f4f4f4',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          {response}
        </pre>
      </div>
    </div>
  );
}
