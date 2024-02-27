const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
var cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;
app.use(cors())


const uri = "mongodb+srv://rstreamingentertainment:RSTREAMING%401234@cluster0.lqhakio.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', async (req, res) => {
 res.setHeader("Access-Control-Allow-Origin", "*")
res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader("Access-Control-Max-Age", "1800");
res.setHeader("Access-Control-Allow-Headers", "content-type");
res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
  try {
    await client.connect();
    console.log('Connected to the database');
    const database = client.db('movies');
    const collections = await database.listCollections().toArray();

    const allData = [];

    for (const collection of collections) {
      const collectionName = collection.name;
      const collectionData = await database.collection(collectionName).find().toArray();
      // console.log(`${collectionName}:`, collectionData);
      allData.push({ collectionName, collectionData });
    }

    res.json(allData);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
});

app.listen(port, () => {
  console.log(`we connected at ${port}`);
});
