const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const port = process.env.port || 4000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6c8obk5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeCollection = client.db('coffeeDB').collection('coffee')

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const selectedCoffee = await coffeeCollection.findOne(query)
            res.send(selectedCoffee)
        })

        app.post('/coffee', async (req, res) => {
            const coffee = req.body;
            console.log(coffee)
            const result = await coffeeCollection.insertOne(coffee)
            res.send(result)
        })

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedDetails = req.body; 
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const newDetails = {
                $set: {
                    coffee: updatedDetails.coffee,
                    quantity: updatedDetails.quantity,
                    supplier: updatedDetails.supplier,
                    taste: updatedDetails.taste,
                    category: updatedDetails.category,
                    details: updatedDetails.details,
                    photo: updatedDetails.photo,
                }
            }
            const result = await coffeeCollection.updateOne(filter, newDetails, options)
            res.send(result)
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('coffie server is running')
})

app.listen(port, () => console.log('running on port', port))