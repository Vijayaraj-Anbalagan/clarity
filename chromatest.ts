async function fetchStoredData() {
  try {
    const client = new ChromaClient({ path: 'http://13.201.136.8:8000' });

    // Access the collection
    const collection = await client.getCollection({
      name: 'company_handbook24',
    });

    // Retrieve data from the collection
    const storedData = await collection.get();
    console.log('Stored Data:', JSON.stringify(storedData));
  } catch (error) {
    console.error('Error fetching stored data:', error);
  }
}

fetchStoredData();
