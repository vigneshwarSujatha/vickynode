const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'MyDBName';
let db = null;
 
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to server");
  db = client.db(dbName);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));

app.post('/saveEmployee', function(req, res){
    console.log(req.body)
    db.collection('employee').insertMany([
        req.body
      ], function(err, result) {
        console.log("Inserted 3 documents into the collection");
        res.send({
            message: 'Employee added!!'
        })
      });
});

app.post('/saveDepartment', function(req, res){
    console.log(req.body)
    db.collection('departmnet').insertMany([
        req.body
      ], function(err, result) {
        console.log("Inserted one department into the collection");
        res.send({
            message: 'Department added!!'
        })
      });
});

app.get('/getAllEmployee',function(req,res){
    db.collection('employee').find({}).toArray(function(err, docs) {
        //assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        res.send(docs);
      });
})

app.get('/findEmployee/:name',function(req,res){
    db.collection('employee').findOne({"name": req.params.name}, function(err, docs) {
        //assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        res.send(docs);
      });
})

app.put('/updateEmployee/:id',function(req,res){
    db.collection('employee').updateOne({ "_id" : objectId(req.params.id) }
        , { $set:req.body }, function(err, result) {
        console.log("Updated the document with the field a equal to 2");
        res.send(result);
      });
})
app.listen(3000)