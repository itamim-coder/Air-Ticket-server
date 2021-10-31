const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.srriw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('myTravel');
        const serviceCollection = database.collection('flights');
        const orderCollection =  database.collection('orders')

        //GET services api
        app.get('/flights', async (req,res) =>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        });

        //GET Single Service
        app.get('/flights/:id', async (req, res) =>{
            const id = req.params.id;
            console.log('get spec service', id)
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.json(service); 
        });
        //Add Orders Api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.json(result);
        });
        //POST API
        app.post('/flights', async(req, res)=>{
            const service = req.body;
            
            const result = await serviceCollection.insertOne(service);
            res.json(result)
        })

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('running service server')
});

app.listen(port, ()=>{
    console.log('running server', port);
})