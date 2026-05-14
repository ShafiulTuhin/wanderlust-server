const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const port = process.env.PORT;
const uri = process.env.MONGODB_URI;

// middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // await client.connect();

    const db = client.db("wanderlust");
    const destinationCollection = db.collection("destinations");
    const bookingCollection = db.collection("bookings");
    // create destinations:
    app.post("/destination", async (req, res) => {
      const destination = req.body;

      const result = await destinationCollection.insertOne(destination);
      res.send(result);
    });
    // Get all destinations
    app.get("/destination", async (req, res) => {
      const result = await destinationCollection.find().toArray();
      res.send(result);
    });
    // Get single destination
    app.get("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await destinationCollection.findOne(query);
      res.send(result);
    });
    // Update destination:
    app.patch("/destination/:id", async (req, res) => {
      const { id } = req.params;
      // const query = {
      //   _id: new ObjectId(id),
      // };
      const updateData = req.body;
      const result = await destinationCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );
      res.send(result);
    });
    // Delete destination
    app.delete("/destination/:id", async (req, res) => {
      const { id } = req.params;
      const query = {
        _id: new ObjectId(id),
      };
      const result = destinationCollection.deleteOne(query);
      res.send(result);
    });
    // create booking data
    app.post("/booking", async (req, res) => {
      const body = req.body;
      const result = await bookingCollection.insertOne(body);
      res.send(result);
    });
    // Get all bookings:
    app.get("/booking/:id", async (req, res) => {
      const { id } = req.params;
      const result = await bookingCollection.find({ userId: id }).toArray();
      res.send(result);
    });
    // Delete booking:
    app.delete("/booking/:id", async (req, res) => {
      const { id } = req.params;
      const query = {
        _id: new ObjectId(id),
      };
      const result = bookingCollection.deleteOne(query);
      res.send(result);
    });
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!",
    // );
  } catch (err) {
    console.log(err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Setup complete for server");
});

app.listen(5000, () => {
  console.log(`listen from port: ${port}`);
});
