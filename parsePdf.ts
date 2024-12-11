const fs = require('fs');
const path = require('path');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const PDFParser = require ('pdf-parse');


/**
 * Function to parse PDF and chunk the text into manageable pieces
 * @param pdfFilePath - Path to the PDF file
 */
async function parseAndChunkPDF(pdfFilePath: string) {
    try {
        console.log('Starting PDF parsing process...');

        if (!fs.existsSync(pdfFilePath)) {
            throw new Error(`File not found: ${pdfFilePath}`);
        }

        console.log(`Reading PDF file from path: ${pdfFilePath}`);

        const pdfParser = new PDFParser();
        pdfParser.loadPDF(pdfFilePath);

        const pdfContent = await new Promise<string>((resolve, reject) => {
            pdfParser.on('pdfParser_dataError', (err: { parserError: any; }) => reject(err.parserError));
            pdfParser.on('pdfParser_dataReady', () => {
                const rawText = pdfParser.getRawTextContent();
                resolve(rawText);
            });
        });

        console.log('PDF content successfully extracted.');

        console.log('Splitting text into manageable chunks...');

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 300,
            chunkOverlap: 0,
        });

        const chunks = textSplitter.splitText(pdfContent);

        console.log(`Text successfully split into ${(await chunks).length} chunks.`);

        const documents = chunks;
        const ids = (await chunks).map((_: any, index: number) => `id${index + 1}`);

        if ((await documents).length !== ids.length) {
            throw new Error('Mismatch between document and ID counts.');
        }

        console.log('Chunks and IDs generated successfully.');

        return { documents, ids };
    } catch (error) {
        console.error('An error occurred while parsing and chunking the PDF:', error);
        throw error;
    }
}

// Example usage
(async () => {
    const pdfFilePath = path.join(__dirname, 'hr.pdf'); // Replace with your PDF file path
    try {
        const { documents, ids } = await parseAndChunkPDF(pdfFilePath);

        console.log('Documents:', documents);
        console.log('IDs:', ids);
    } catch (error) {
        console.error('Error processing PDF:', error);
    }
})();
