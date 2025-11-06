const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require("dotenv").config();

const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ojq4cou.mongodb.net/?appName=Cluster0`;

//middelware
app.use(cors());
app.use(express.json())

const port = process.env.PORT || 3000;

//Server main api
app.get("/", (req, res) => {
    res.send("Coffee Server is Running...")
    
})

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const run = async () => {
    
  try {
    await client.connect();
      // Send a ping to confirm a successful connection
      
      const db = client.db("coffeeStore_DB");
      const coffeeStoreColectoin = db.collection("coffees");

      app.post("/coffees", async (req, res) => {
          const newCoffee = req.body;
          const result = await coffeeStoreColectoin.insertOne(newCoffee);
          res.send(result);
      })

      app.get("/coffees", async (req, res) => {
          const cursor = coffeeStoreColectoin.find();
          const result = await cursor.toArray();
          res.send(result)
      })
    
    app.get("/productDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeStoreColectoin.findOne(query);
      res.send(result);
    })

    app.get("/updateCoffeeDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeStoreColectoin.findOne(query);
      res.send(result);
    })

    app.patch("/updateCoffeeDetails/:id", async (req, res)=>{
      const id = req.params.id;
      const updateProduct = req.body;
      const query = { _id: new ObjectId(id) }
      const update = { $set: {
          name: updateProduct.name,
          chef: updateProduct.chef,
          supplier: updateProduct.supplier,
          taste: updateProduct.taste,
          category: updateProduct.category,
          details: updateProduct.details,
          image: updateProduct.image,
      }
      }
      const result = await coffeeStoreColectoin.updateOne(query,update);
      res.send(result)

    })

app.delete("/coffees/:productId", async (req, res) => {
        const productId = req.params.productId;
        const query = { _id: new ObjectId(productId) }
        const result = await coffeeStoreColectoin.deleteOne(query);
        res.send(result)
      })
      
      

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);




app.listen(port, (req, res) => {
    console.log(`Coffee Server is Listen port: ${port}`);
})