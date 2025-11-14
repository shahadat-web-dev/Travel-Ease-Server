
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.TE_USER}:${process.env.TE_PASS}@cluster0.ggi8ddh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.get('/', (req, res) => {
  res.send('taravel server is running');
});



run().catch(console.dir)

app.listen(port, () => {
  console.log(`Traver server is running on port: ${port}`);

});