const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// Midware

app.use(cors());
app.use(express.json());
//

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@auto-cars-cluster.qvigm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const carsCollection = client.db("carsDB").collection("products");
    // Load All Cars
    app.get("/cars", async (req, res) => {
      const query = {};
      const cursor = carsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //Load single cars
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carsCollection.findOne(query);
      res.send(result);
    });
    //Update Quantity of cars
    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const carsData = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: carsData.quantity,
        },
      };
      const result = await carsCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    //Delete A products
    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carsCollection.deleteOne(query);
      res.send(result);
    });

    //Insert A data
    app.post("/car", async (req, res) => {
      const doc = req.body;
      const result = await carsCollection.insertOne(doc);
      res.send(result);
    });


  } finally {
    // console.log("object");
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("wearhouse is active");
});

app.listen(port, () => {
  console.log("listening from port ", port);
});
