const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
// const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.port || 5001;
app.use(cors());
app.use(express.json());

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${user}:${password}@cluster0.7zgohpc.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send({ message: "hello world" });
});
async function run() {
  try {
    const users = client.db("Users").collection("Users");

    app.post("/insertusertodb", async (req, res) => {
      const userInfo = req.body;
      console.log(userInfo);
      const result = await users.insertOne(userInfo);
      res.send(result);
    });
    app.get("/checkuseralreadyindatabase", async (req, res) => {
      const uid = req?.query?.uid;

      const query = { uid: uid };
      const result = await users.findOne(query);
      //   console.log(result);
      if (result) {
        res.send({ isUserAlreadyExists: true });
      } else {
        res.send({ isUserAlreadyExists: false });
      }
    });
  } finally {
  }
}
run().catch(console.log());

app.listen(port, () => {
  console.log("listening on port", port);
});
