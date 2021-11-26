const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;
// middleware 
app.use(cors());
app.use(express.json())

// healthcoaching
// RzqrpJQwkfVqFCpo

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pr0er.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
try{
await client.connect();
console.log('connected to database');
// database and collections 
const database = client.db("healthCoaching");
const coachingCollection = database.collection("coaching");
const orderCollection = database.collection("orders");

// get api for all products
app.get('/coaching', async(req,res)=>{
    const cursor = coachingCollection.find({});
    const products = await cursor.toArray();
    res.send(products);
  });

  // get api for all orders 
  app.get('/orders', async(req,res)=>{
    const cursor = orderCollection.find({});
   const orders = await cursor.toArray();
   res.send(orders);
  });

  // get single product 
app.get('/coaching/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const product = await coachingCollection.findOne(query);
    res.json(product);
  
  })

// post api for posting all products
app.post('/coaching', async(req,res)=>{
    const product = req.body;
    console.log('hit the post api',product);
  
    const result = await coachingCollection.insertOne(product);
     res.json(result)
  
  });

  // post api for ordering products 
app.post('/orders', async(req,res)=>{
    const item = req.body;
    console.log('hit the post api again',item);
  
    const result = await orderCollection.insertOne(item);
     res.json(result)
  
  });

}
finally{

}

}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})