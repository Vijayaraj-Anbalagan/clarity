const axios = require('axios');
const fs = require('fs');
const FormDataLib = require('form-data');
const { ChromaClient } = require('chromadb');


async function parseAndFetchPDFResult(pdfFilePath: string, apiKey: string) {
  try {
    // Step 1: Upload PDF for parsing
    const form = new FormDataLib();
    form.append('file', fs.createReadStream(pdfFilePath)); // Add the PDF file
    form.append('is_formatting_instruction', 'true'); // Enable formatting instructions
    form.append(
      'parsing_instruction',
      `Goal: Parse the company handbook into smaller chunks, assign unique IDs, attach relevant metadata, and ensure clean, professional content.
  Chunking: Split the document into small chunks based on logical breaks such as sections (e.g., "HR Policies", "IT Support") and topics (e.g., "Leave Policy", "Laptop Issues"). 
  Ensure chunk size does not exceed 500 words.
  ID Format: <company_name>_<section_name>_<topic_name>_p<page_number>_c<chunk_number> (Example: CompanyName_HRPolicy_LeavePolicy_p1_c2)
  Metadata: Include section, topic, page, and relevant keywords. If any of these are missing, ensure they are still included as empty or default values.
  Text Extraction: Remove excess newlines, irrelevant formatting, and footnotes. Each chunk should be readable and self-contained.
  Bad Words Filtering: Ensure that text is professional by filtering bad words.
  Ensure that the number of IDs, metadata entries, and documents are aligned, and no entries are missing.`
    );

    form.append('disable_ocr', 'true');
    form.append('structured_output', 'true');
    form.append('output_format', 'json');
    form.append(
      'structured_output_json_schema',
      `{
      "type": "object",
      "properties": {
        "ids": {
          "type": "array",
          "items": { "type": "string", "description": "Unique ID for each document chunk  ID Format: <company_name>_<section_name>_<topic_name>_p<page_number>_c<chunk_number> (Example: CompanyName_HRPolicy_LeavePolicy_p1_c2) " }
        },
        "metadatas": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "section": { "type": "string", "description": "The overall section the chunk belongs to" },
              "topic": { "type": "string", "description": "The specific topic within the section" },
              "page": { "type": "integer", "description": "The page number from which the chunk was extracted" },
              "keywords": {
                "type": "array",
                "items": { "type": "string", "description": "Relevant keywords associated with the chunk" }
              }
            },
            "required": ["section", "topic", "page", "keywords"]
          }
        },
        "documents": {
          "type": "array",
          "items": { "type": "string", "description": "The textual content of each chunk" }
        }
      },
      "required": ["ids", "metadatas", "documents"]
    }`
    );

    const uploadResponse = await axios.post(
      'https://api.cloud.llamaindex.ai/api/parsing/upload',
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const jobId = uploadResponse.data.id;
    console.log('Parsing started. Job ID:', jobId);

    // Step 2: Poll for job status
    let jobStatus = 'PENDING';
    while (jobStatus === 'PENDING') {
      const statusResponse = await axios.get(
        `https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      jobStatus = statusResponse.data.status;

      if (jobStatus === 'COMPLETED') {
        console.log('Parsing completed.');
        break;
      } else if (jobStatus === 'FAILED') {
        console.error('Parsing failed.');
        return;
      }

      console.log('Parsing still pending. Retrying...');
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds before retrying
    }

    // Step 3: Fetch parsed result
    const resultResponse = await axios.get(
      `https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}/result/json`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const pages = resultResponse.data.pages;

    const client = new ChromaClient({ path: 'http://13.201.136.8:8000' });

    // Insert data into ChromaDB
    const collection = await client.createCollection({
      name: 'company_handbook24',
    });

    // Loop through pages and extract ids, metadata, and documents
    const promises = pages.map(async (page: any) => {
      const structuredData = page.structuredData;

      if (structuredData) {
        const {
          ids: pageIds,
          metadatas: pageMetadatas,
          documents: pageDocuments,
        } = structuredData;

        // Validate and align data
        const validPageIds = Array.isArray(pageIds) ? pageIds : [];
        const validPageDocuments = Array.isArray(pageDocuments)
          ? pageDocuments
          : [];
        const validPageMetadatas = Array.isArray(pageMetadatas)
          ? pageMetadatas.map((metadata) => ({
              section: metadata.section || 'Unknown Section',
              topic: metadata.topic || 'Unknown Topic',
              page: metadata.page || 0,
              keywords: Array.isArray(metadata.keywords)
                ? metadata.keywords
                : [],
            }))
          : [];

        console.log('Upserting Data:', {
          ids: validPageIds,
          documents: validPageDocuments,
          metadatas: validPageMetadatas,
        });

        try {
          // Perform upsert
          await collection.upsert({
            ids: validPageIds,
            documents: validPageDocuments,
            metadatas: validPageMetadatas,
          });

          console.log('Data Added to ChromaDB');
        } catch (error) {
          console.error('Error during upsert:', error);
        }
      }
    });

    await Promise.all(promises);
  } catch (error) {
    if (error instanceof Error) {
      if (axios.isAxiosError(error)) {
        console.error('Error during the process:', error.message || error);
      } else {
        console.error('Error during the process:', error.message || error);
      }
    } else {
      console.error('Error during the process:', error);
    }
  }
}

// Usage
const pdfFilePath = './StratoSenseHR.pdf'; // Path to your PDF file

const apiKey = 'llx-UV4OMaua58thneH8I5SUKzE5pRzYfmdiOfljdcl7yKbVRSkR'; // Your API key

parseAndFetchPDFResult(pdfFilePath, apiKey);
