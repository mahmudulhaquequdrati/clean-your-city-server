const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const { json } = require("express");
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tkswl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("cleaning_services");
    const serviceCollection = database.collection("services");
    const orderCollection = database.collection("orders");
    const testimonialCollection = database.collection("testimonials");

    // get services
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // get testimonials
    app.get("/testimonials", async (req, res) => {
      const cursor = testimonialCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // post data to server
    // sending order info to the server
    app.post("/servicesOrder", async (req, res) => {
      const servicesOrder = req.body;
      const result = await orderCollection.insertOne(servicesOrder);
      res.json(result);
    });

    // send testimonial to database
    app.post("/testimonials", async (req, res) => {
      const testimonial = req.body;
      const result = await testimonialCollection.insertOne(testimonial);
      res.json(result);
    });

    // send service to database
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.json(result);
    });

    // get all orders
    app.get("/allorders", async (req, res) => {
      const cursor = orderCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // get order by filtering user
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // final
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to cleaning services world!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
