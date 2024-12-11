'use client';

import React, { useState } from 'react';

export default function UploadResume() {
  const [documents, setDocuments] = useState<string[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file.');
      }

      const result = await response.json();
      setDocuments(result.documents); // Array of text chunks
      setIds(result.ids); // Corresponding IDs
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="flex flex-col items-start mt-6">
      <div className="text-lg font-bold mb-2 dark:text-white">
        Upload your Resume
        <span> (.pdf)</span>:
      </div>
      <div className="w-full">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Upload
        </button>
      </div>
      {documents.length > 0 && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white">
          <div className="text-lg font-bold mb-2">Extracted Text Chunks:</div>
          {documents.map((doc, index) => (
            <div key={ids[index]} className="mb-4">
              <div className="font-semibold">ID: {ids[index]}</div>
              <p>{doc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
