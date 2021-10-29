const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();
const port = 5000;

const username = process.env.DB_USER;
const password = process.env.DB_PASS;

const uri = `mongodb+srv://${username}:${password}@cluster0.in8lp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function run() {
    try {
        await client.connect();
        const database = client.db("geniusCarDB");
        const collection = database.collection("haiku");
        // create a document to insert
        app.post("/services", async (req, res) => {
            const service = req.body;
            const result = await collection.insertOne(service);
            res.json(result);
            console.log(service);
        })

        app.get('/services', async (req, res) => {
            const cursor = await collection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('genius car');
})

app.listen(port, () => {
    console.log('listening on port= ' + port);
});