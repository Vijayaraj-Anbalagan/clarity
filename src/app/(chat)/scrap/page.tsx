'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleScrape = async () => {
    setMessage('');
    try {
      const response = await fetch('/api/scrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Scraping succeeded.');
      } else {
        setMessage(data.error || 'Scraping failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <div>
      <h1>Web Scraper</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL"
        style={{ marginRight: '10px' }}
      />
      <button onClick={handleScrape}>Scrape</button>
      {message && <p>{message}</p>}
    </div>
  );
}
