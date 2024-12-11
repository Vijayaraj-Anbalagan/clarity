import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export async function POST(req: NextRequest) {
  try {
    // Extract FormData from the incoming request
    const formData = await req.formData();

    // Get the actual file from FormData
    const uploadedFile = Array.from(formData.entries())
      .map(([key, value]) => value)
      .find((value) => value instanceof File) as File | undefined;

    // Validate the uploaded file
    if (!uploadedFile) {
      return NextResponse.json({ error: 'No valid file uploaded' }, { status: 400 });
    }

    // Generate a unique filename for reference (optional)
    const now = new Date();
    const datePart = `${now.getHours()}${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}`;
    const fileName = `${datePart}-${uploadedFile.name.replace(/[^a-z0-9.]/gi, '_')}`;

    // Convert the file to a buffer
    console.log(fileName);
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

    // Parse the PDF content
    const pdfData = await pdfParse(fileBuffer);
    const parsedText = pdfData.text;

    // Split the text into manageable chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 0,
    });

    const chunks = textSplitter.splitText(parsedText);
    const documents = chunks; // Array of text chunks
    const ids = (await chunks).map((_: any, index: number) => `id${index + 1}`); // Corresponding IDs

    console.log('Chunks and IDs generated successfully.', documents, ids);

    // Respond with extracted text, chunks, and IDs
    return NextResponse.json({
      text: parsedText,
      fileName,
      documents,
      ids,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
