
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


async function run() {
  try {

    await client.connect();

    const db = client.db('travel_db');
    const productsCollection = db.collection('products');
    const usersCollection = db.collection('users');
    const bookingsCollection = db.collection('bookings');
    const vehiclesCollection = db.collection('vehicles');

    //   Update
    app.patch('/vehicles/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: new ObjectId(id) }
      const update = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.owner,
          price: updatedProduct.category,
          price: updatedProduct.pricePerDay,
          price: updatedProduct.location,
          price: updatedProduct.location,
          price: updatedProduct.description,
          price: updatedProduct.coverImage,
        }
      }
      const result = await vehiclesCollection.updateOne(query, update);
      res.send(result)
    });


    // Add Vehicles 
    app.post('/vehicles', async (req, res) => {
      const newVehicles = req.body;
      const result = await vehiclesCollection.insertOne(newVehicles);
      res.send(result);
    });

  //  
    app.get("/vehicles/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await vehiclesCollection.findOne(query);
      res.send(result);
    });


    // Get vehicles
    app.get("/vehicles", async (req, res) => {
      try {
        const email = req.query.email;
        let query = {};
        if (email) {
          query = { ownerEmail: email };
        }
        const result = await vehiclesCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });


    // Vehicles delete
    app.delete('/vehicles/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await vehiclesCollection.deleteOne(query);
        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Vehicle not found" });
        }
        res.send({ message: "Vehicle deleted successfully" });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });


 



    // BookNow Data 
    app.post('/bookings', async (req, res) => {
      const newBookings = req.body;
      const result = await bookingsCollection.insertOne(newBookings);
      res.send(result);
    });



    // User Post
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email }
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        res.send('user already exits. do not need to insert again')
      }
      else {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }
    })


    // Products get All products : find()
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    //  letes product
    app.get('/latest-products', async (req, res) => {
      const cursor = productsCollection.find().sort({ pricePerDay: 1 }).skip(14).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    })



    // Products get single products : findOne()
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.findOne(query);
      res.send(result);
    })


    // Products Post : 
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result)
    });

    // Products Patch :
    app.patch('/products/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: new ObjectId(id) }
      const update = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price
        }
      }
      const result = await productsCollection.updateOne(query, update);
      res.send(result)

    });

    // Products Delete :
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  }
  finally {

  }

}
run().catch(console.dir)

app.listen(port, () => {
  console.log(`Traver server is running on port: ${port}`);

});