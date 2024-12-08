import { ChromaClient as MyCromaClient } from 'chromadb';
import { NextRequest } from 'next/server';


export async function POST(req: NextRequest) {
  const { query } = await req.json();
  try {
    const client = new MyCromaClient({ path: 'http://13.201.136.8:8000' });
    const collection = await client.getOrCreateCollection({
      name: 'company_handbook2',
    });

    // Retrieve data from the collection
    const storedData = await collection.query({
      queryTexts: [query],
      nResults: 5,
    });
    console.log('Stored Data:', storedData);
    return storedData.documents?.[0]?.[0] ?? null; // Return the document or null
  } catch (error) {
    console.error('Error fetching stored data:', error);
    return null;
  }
}
