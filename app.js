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
MongoClient.connect(url, function (err, client) {
  console.log("Connected successfully to server");
  db = client.db(dbName);
});

let allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));
app.use(allowCrossDomain);

app.post('/saveEmployee', function (req, res) {
  console.log(req.body)
  db.collection('employee').insertMany([
    req.body
  ], function (err, result) {
    console.log("Inserted 3 documents into the collection");
    res.send({
      message: 'Employee added!!'
    })
  });
});

app.post('/saveDepartment', function (req, res) {
  console.log(req.body)
  db.collection('departmnet').insertMany([
    req.body
  ], function (err, result) {
    console.log("Inserted one department into the collection");
    res.send({
      message: 'Department added!!'
    })
  });
});

app.get('/getAllEmployee', function (req, res) {
  db.collection('employee').find({}).toArray(function (err, docs) {
    //assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    res.send({
      sucess: true,
      data: docs
    });
  });
})

app.get('/findEmployee/:name', function (req, res) {
  db.collection('employee').find({ "name": { '$regex': `^${req.params.name}`, '$options': 'i' } }).toArray(function (err, docs) {
    //assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    if (docs.length > 0) {
      res.send({
        sucess: true,
        data: docs
      });
    } else {
      res.send({
        sucess: true,
        data: []
      });
    }
  });
})

app.put('/updateEmployee/:id', function (req, res) {
  db.collection('employee').updateOne({ "_id": objectId(req.params.id) }
    , { $set: req.body }, function (err, result) {
      console.log("Updated the document with the field a equal to 2");
      res.send(result);
    });
})
app.listen(3000)