const { ChromaClient } = require('chromadb');

async function fetchStoredData() {
  try {
    const client = new ChromaClient({ path: 'http://13.201.136.8:8000' });
    // Access the collection
    const collection = await client.getOrCreateCollection({
      name: 'company_handbook2',
    });

    // Retrieve data from the collection
    const storedData = await collection.query({
      queryTexts: ['Tell about company working hours'],
      nResults: 1,
    });
    console.log('Stored Data:', JSON.stringify(storedData));
  } catch (error) {
    console.error('Error fetching stored data:', error);
  }
}

fetchStoredData();
