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
    await client.connect();

    const db = client.db("wanderlust");
    const destinationCOllection = db.collection("destinations");
    // create destinations:
    app.post("/destination", async (req, res) => {
      const destination = req.body;

      const result = await destinationCOllection.insertOne(destination);
      res.send(result);
    });
    // Get all destinations
    app.get("/destination", async (req, res) => {
      const result = await destinationCOllection.find().toArray();
      res.send(result);
    });
    // Get single destination
    app.get("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await destinationCOllection.findOne(query);
      res.send(result);
    });
    // Update destination:
    app.patch("/destination/:id/edit", async (req, res) => {
      const { id } = req.params;
      // const query = {
      //   _id: new ObjectId(id),
      // };
      const updateData = req.body;
      const result = await destinationCOllection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );
      res.send(result);
    });

    app.delete("/destination/:id", async (req, res) => {
      const { id } = req.params;
      const query = {
        _id: new ObjectId(id),
      };
      const result = destinationCOllection.deleteOne(query);
      res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
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
