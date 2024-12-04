const axios = require('axios');
const fs = require('fs');
const FormDataLib = require('form-data');

async function parsePDF() {
  const pdfFilePath = './hr.pdf';  // Path to your PDF file

  // Create form data to send the PDF
  const form = new FormDataLib();
  
  // Append the file stream correctly
  form.append('file', fs.createReadStream(pdfFilePath)); // Append the file as a stream

  // Append other fields for parsing instructions and formatting
  form.append('is_formatting_instruction', 'true'); // Enable formatting instructions
  form.append('parsing_instruction', 'Parse the company handbook, split by sections, and provide clean text with metadata.');

  try {
    // Send the request to LlamaParse API
    const response = await axios.post(
      'https://api.cloud.llamaindex.ai/api/parsing/upload', // LlamaParse API URL
      form,
      {
        headers: {
          ...form.getHeaders(), // Include correct form headers for file upload
          'Authorization': `Bearer llx-UV4OMaua58thneH8I5SUKzE5pRzYfmdiOfljdcl7yKbVRSkR` // Use your API key
        },
      }
    );

    // Handle and log the response from LlamaParse API
    console.log('Parsed Result:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (axios.isAxiosError(error)) {
        if (error instanceof Error) {
          console.error('Error while parsing the PDF:', (error as any).response?.data || error.message);
        } else {
          console.error('Error while parsing the PDF:', error);
        }
      } else {
        console.error('Error while parsing the PDF:', error);
      }
    } else {
      console.error('Error while parsing the PDF:', error);
    }
  }
}

// Call the parse function
parsePDF();
