const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

const uri =
  'mongodb+srv://rstreamingentertainment:RSTREAMING%401234@cluster0.lqhakio.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get('/', async (req, res) => {
  try {
    await client.connect();
    console.log('Connected to the database');
    const database = client.db('movies');
    const collections = await database.listCollections().toArray();

    const responseData = [];

    // Define the custom order for each collection
    const collectionOrder = {
      'featurefilms': 1,
      'Documentory': 2,
      'shortfilms':3
      // Add more collections and their orders as needed
    };

    for (const collection of collections) {
      const collectionName = collection.name;
      const collectionData = await database.collection(collectionName).find().toArray();
      responseData.push({ collectionName, collectionData });
    }

    // Sort the response based on the specified order or place unspecified ones at the end
    const sortedResponse = responseData.sort((a, b) => {
      const orderA = collectionOrder[a.collectionName] || Number.MAX_SAFE_INTEGER;
      const orderB = collectionOrder[b.collectionName] || Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });

    res.json(sortedResponse);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
});

app.listen(port, () => {
  console.log(`Connected at http://localhost:${port}`);
});
