import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

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

    // Convert the file to a buffer
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

    // Parse the PDF content
    const pdfData = await pdfParse(fileBuffer);
    const parsedText = pdfData.text;

    // Split the parsed text into chunks of 300 characters each
    const chunks = [];
    let start = 0;
    while (start < parsedText.length) {
      let end = start + 300;

      // Adjust end to the next full stop if within bounds
      if (end < parsedText.length) {
      const nextFullStop = parsedText.indexOf('.', end);
      if (nextFullStop !== -1 && nextFullStop < end + 300) {
        end = nextFullStop + 1;
      } else {
        // Adjust end to the next whitespace if no full stop found within bounds
        const nextWhitespace = parsedText.indexOf(' ', end);
        if (nextWhitespace !== -1) {
        end = nextWhitespace;
        }
      }
      }

      // Adjust end to the next full stop or whitespace if a comma is encountered
      const nextComma = parsedText.indexOf(',', start);
      if (nextComma !== -1 && nextComma < end) {
      const nextFullStopAfterComma = parsedText.indexOf('.', nextComma);
      const nextWhitespaceAfterComma = parsedText.indexOf(' ', nextComma);
      if (nextFullStopAfterComma !== -1 && nextFullStopAfterComma < end + 300) {
        end = nextFullStopAfterComma + 1;
      } else if (nextWhitespaceAfterComma !== -1 && nextWhitespaceAfterComma < end + 300) {
        end = nextWhitespaceAfterComma;
      }
      }

      chunks.push(parsedText.substring(start, end).trim());
      start = end;
    }

    // Define an array of bad words to filter out
    const badWords = ['Only a vacuous', 'quite Moronic', 'Idiotic', 'Ridiculous', 'Brainlessly', 'obfuscated'];

    // Function to filter out bad words from a chunk
    const filterBadWords = (text: string) => {
      badWords.forEach((word, index) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      text = text.replace(regex, `FILTERED${index + 1}`);
      });
      return text;
    };

    // Filter bad words from each chunk
    const filteredChunks = chunks.map(chunk => filterBadWords(chunk));
    const documents = filteredChunks; // Array of text chunks
    const ids = (await chunks).map((_: any, index: number) => `id${index + 1}`); // Corresponding IDs

    console.log('PDF successfully parsed and text chunks extracted.',
      documents,
      ids

    );




    // Respond with extracted chunks and IDs
    return NextResponse.json({
      documents,
      ids,
    });
  } catch (error) {
    // Return an error response in case of any issues
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
