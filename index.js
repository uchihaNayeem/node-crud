const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const  ObjectId = require('mongodb').ObjectId;

const uri = "mongodb://organicUser:admin123#@cluster0-shard-00-00.q54ze.mongodb.net:27017,cluster0-shard-00-01.q54ze.mongodb.net:27017,cluster0-shard-00-02.q54ze.mongodb.net:27017/organicdb?ssl=true&replicaSet=atlas-6zmobf-shard-0&authSource=admin&retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const password = 'admin123#'


app.get('/', (req, res)=>{
  res.sendFile(__dirname + '/index.html');
})



MongoClient.connect(uri, {useUnifiedTopology: true}, function(err, client) {
  const productCollection = client.db("organicdb").collection("products");
  // perform actions on the collection object


  app.get('/products',(req, res)=>{
   productCollection.find({})
   .toArray((err, documents)=>{
     res.send(documents);
   })
  })

  app.get('/product/:id', (req, res)=>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents)=>{
      res.send(documents[0]);
    })
  })

  app.post("/addProduct", (req, res) =>{
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      console.log('data added successfully');
      res.redirect('/');
    })
    // console.log(product);
  })

  app.patch('/update/:id', (req, res)=>{
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result =>{
      console.log(result);
    })
  })

  app.delete('/delete/:id', (req, res)=>{
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result)=>{
      res.send(result.deletedCount > 0)
    })
  })



  
  console.log('database connected');

});






app.listen(4200, console.log(`listening from 4200 port`))