'use client';
import { useState } from "react";

export default function LangGraphPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    try {
      const res = await fetch("/api/langgraph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred while processing your query.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">LangGraph Query Handler</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query"
          className="border p-2 rounded-md w-full"
          rows={4}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      {response && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <h2 className="text-xl font-bold">Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
