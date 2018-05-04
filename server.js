var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var app = express();

var db = null;
MongoClient.connect("mongodb://localhost:27017/mittens", function(err, dbconn){
  if(!err){
    console.log('we are connected to db.');
    db = dbconn.db("mittens");
  }

});

app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/meowsPage', function(req, res) {
  res.sendFile(__dirname + "/public/meows.html");
});

//get the meows collection from the db we are connected to, and store result in meowsCollection.
//do a query on the meowsCollection. Query returns all meows.
app.get('/meows', function(req, res){
  db.collection("meows").find().toArray(function(err, meows) {
    if (!err){
      return res.json(meows);
    }
  });
});

app.post('/meows', function(req, res){
  var text = req.body.newMeow;
  db.collection("meows").insert({text}, {w:1}, function(err) {
    if (!err){
      return res.send();
    }
  });
});

app.put('/meows/remove', function(req, res){
  var removequery = { _id: new ObjectID(req.body.meow._id)};
  db.collection("meows").deleteOne(removequery, function(err) {
    if (!err){
      return res.send();
    }
  });
});

app.listen(3000, function(){
  console.log('Server running on port 3000...');
});
