'use client';
import React, { useState } from 'react';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/pdfttemp', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadStatus('File uploaded successfully.');
        setFiles((prevFiles) => [...prevFiles, data]); // Add new file to the list
      } else {
        setUploadStatus(data.error || 'Upload failed.');
      }
    } catch (error) {
      setUploadStatus('An error occurred while uploading the file.');
    }
  };


  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload a File</h1>
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
      {fileUrl && (
        <p>
          File URL: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a>
        </p>
      )}
    </div>
  );
};

export default UploadPage;
