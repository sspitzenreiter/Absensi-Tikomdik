var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var mongo = require("mongodb");
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";

const io = require('socket.io')(4000, {
 
  serveClient: false,
  pingInterval:10000,
  pingTimeout: 5000
});

io.on('connect', (socket)=>{
  console.log('Connected');
});

MongoClient.connect(url, function(err, db){
  if(err) throw err;
  var dbo = db.db("UserDB");
  dbo.collection("User").watch().on('change', (data)=>{
    console.log(new Date(), data.fullDocument.name);
    var tanggal = new Date();
    var tanggal_edited = tanggal.getDate()+"-"+(tanggal.getMonth()+1)+"-"+tanggal.getFullYear()+" "+tanggal.getHours()+":"+tanggal.getMinutes()+":"+tanggal.getSeconds();

    io.emit('absen', {tanggal_absen:tanggal_edited, nama:data.fullDocument.name});
  })
});


router.get('/', function(req, res, next) {
  res.send('s');
});

module.exports = router;
