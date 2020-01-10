var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var mongo = require("mongodb");
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";
const ZKLib = require('zklib');
const axios = require('axios');
var waterfall = require('async-waterfall');
ZK = new ZKLib({
  ip: '192.168.100.41',
  port: 4370,
  inport: 5200,
  timeout: 5000
});
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
insertManyCollection=(doc, data, callback)=>{
  MongoClient.connect(url, function(err, db){
    if(err) throw err;
    var dbo = db.db("AbsenTikomdik");
    dbo.createCollection(doc, function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
    });
    dbo.collection(doc).insertMany(data, (err, result)=>{
      
      callback(err, result);
      //res.send('Sukses, telah memasukkan sebanyak');
      //db.close();
    });
  });
}

insertOneCollection=(doc, data, callback)=>{
  MongoClient.connect(url, function(err, db){
    if(err) throw err;
    var dbo = db.db("AbsenTikomdik");
    dbo.collection(doc).insertOne(data, (err, result)=>{
      callback(err, result);
    });
  });
}

getCollection=(doc, where, callback)=>{
  MongoClient.connect(url, function(err, db){
    if(err) throw err;
    var dbo = db.db("AbsenTikomdik");
    dbo.createCollection(doc, function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
    });
    dbo.collection(doc).find(where).toArray((err, result)=>{
      if(err) {
        console.log(err);
        throw err;
      }
      callback(result);
      db.close();
    });
  });
}

getKedatangan=(callback)=>{
  MongoClient.connect(url, function(err, db){
    if(err) throw err;
    var dbo = db.db("AbsenTikomdik");
    var tanggal_server = new Date();
    var hari = tanggal_server.getDate();
    var bulan = tanggal_server.getMonth()+1;
    var tahun = tanggal_server.getFullYear();
    dbo.collection('kedatangan').aggregate(
      [
        {$addFields:{
          hari:{$dayOfMonth:"$tanggal"}, 
          bulan:{$month:"$tanggal"}, 
          tahun:{$year:"$tanggal"}
        }}, 
        {$match:{hari:hari, bulan:bulan, tahun:tahun}}
      ]).toArray((err, result)=>{
      if(err) throw err;
      callback(err, result);
      db.close();
    });
  });

}

getOneCollection=(doc, where, callback)=>{
  MongoClient.connect(url, function(err, db){
    if(err) throw err;
    var dbo = db.db("AbsenTikomdik");
    // dbo.createCollection(doc, function(err, res) {
    //   if (err) throw err;
    //   console.log("Collection created!");
    // });
    dbo.collection(doc).find(where).toArray((err, result)=>{
      if(err) throw err;
      callback(err, result);
      db.close();
    });
  });
}

router.get('/show-users', (req, res, next)=>{
  getCollection('user', {}, (result)=>{
    for(var a=0;a<result.length;a++){
      delete result[a]._id;
    }
    res.send(result);
  })
})

router.get('/show-kedatangan', (req, res, next)=>{
  //res.send('Data Requested');
  getKedatangan((err, result_kedatangan)=>{
    result_kedatangan.forEach((data,i)=>{
      var send_data = result_kedatangan[i];
      var tanggal_absen = new Date(data.tanggal);
      console.log("bisa");
      var jam = new Date(send_data.tanggal).getHours()*60;
      var menit = new Date(send_data.tanggal).getMinutes();
      getOneCollection('user', {"userid":send_data.pin}, (err, result)=>{
        var data_user = result[0];
        var param_jam = 450;
        if(result.status_pns!=='undefined' && result.bagian!=='undefined'){
          send_data['waktu'] = param_jam-(jam+menit);
          send_data['nama'] = data_user.name;
          send_data['jabatan'] = data_user.bagian;
          send_data['status_pns'] = data_user.status_pns;
          console.log("Data user", send_data);
          //io.emit('absen', send_data);
          if(i===result_kedatangan.length-1){
            res.send(result_kedatangan);
          }
        }
      })
    })
  })
})
setInterval(()=>{
  console.log('Streaming data...');
  axios.get('http://localhost/Attend/tarik-data.php?ip=192.168.100.41&key=0').then((responder)=>{
    if(Array.isArray(responder.data)){
      if(responder.data.length>0){
        // insertManyCollection('kedatangan_dump', responder.data, (err, result)=>{
          
        // });
        responder.data.forEach((data, i)=>{
          data.tanggal = new Date(data.tanggal);
          getOneCollection('kedatangan', data, (err, result)=>{
            if(result.length<1){
              console.log('Data Gak ada, Inserting');
              insertOneCollection('kedatangan', data, (err, result)=>{
                
              });
            }
          });
        });
        // insertManyCollection('kedatangan', responder.data, (err, result)=>{
           
        // });
      }else{
        console.log('Data Kosong');
      }    
    }else{
      console.log('Data error');
    }
  }).catch((error)=>{
    console.log(error);
  });
  if(new Date().getHours()==12){
    // axios.get("http://localhost/attend/PHP-soap-baru/clear-data.php?ip=192.168.100.41&key=0").then((clear_responden)=>{
      
    //     //res.send('Sukses');
    // });
  }
}, 5000)

router.get('/sync-data', (req, res, next)=>{
  axios.get('http://localhost/attend/PHP-soap-baru/tarik-data.php?ip=192.168.100.41&key=0').then((responder)=>{
    if(responder.data.length>0){
      console.log('data ada');
      insertManyCollection('kedatangan_dump', responder.data, (err, result)=>{
        
      });
      responder.data.forEach((data, i)=>{
        data.tanggal = new Date(data.tanggal);
      });
      insertManyCollection('kedatangan', responder.data, (err, result)=>{
        axios.get("http://localhost/attend/PHP-soap-baru/clear-data.php?ip=192.168.100.41&key=0").then((clear_responden)=>{
          res.send(clear_responden);
          //res.send('Sukses');
        });
      });
    }else{
      res.send('Data Kosong');
    }    
  }).catch((error)=>{
    console.log(error);
  })
})

router.get('/sync-user', (req, res, next)=>{
  ZK.connect((err)=>{
    if(err) throw err;

    ZK.getUser((err, result)=>{
      if(err) throw err;
      // res.send(JSON.stringify(t));
      // console.log(t.toString());
      // insertManyCollection('user', t);
      result.forEach((item, i)=>{
        getOneCollection('user', {"userid":item.userid}, (err, result)=>{
          if(result.length==0 && item.name!="Cucu Sumiati" && item.name!="Andri Eliyas"){
            console.log(JSON.stringify(item));
            insertOneCollection('user', item, (err, result)=>{
              console.log(item.name+" Inserted");
            })
          }
        })
      })
      
      //res.send(JSON.stringify(t));
      ZK.disconnect();
    })
    res.send('data');
  })
});

router.get('/cobain', (req, res, next)=>{
  var data = [
    {waktu:10, status:'cepat', nama:'Luthfi'},
    {waktu:2, status:'cepat', nama:'Luthfi'},
    {waktu:9, status:'cepat', nama:'Luthfi'},
    {waktu:-20, status:'telat', nama:'Luthfi'},
    {waktu:-5, status:'telat', nama:'Luthfi'}, 
  ];
  
  console.log(data.indexOf("nama").valueOf());
  res.send('s');
})

const io = require('socket.io')(4000, {
  serveClient: true,
  pingInterval:10000,
  pingTimeout: 5000
});

io.on('connect', (socket)=>{
  console.log('Connected');
});

MongoClient.connect(url, function(err, db){
  if(err) throw err;
  var dbo = db.db("AbsenTikomdik"); //AbsenTikomdik
  dbo.collection("kedatangan").watch().on('change', (data)=>{
    console.log(new Date(), data.fullDocument);
    //res.send(data.fullDocument.name);
    var send_data = data.fullDocument;
    var tanggal_absen = new Date(data.fullDocument.tanggal);
    var tanggal_server = new Date();
    var hari = tanggal_server.getDate();
    var bulan = tanggal_server.getMonth();
    var tahun = tanggal_server.getFullYear();
    console.log("Hari"+hari+", Bulan"+bulan+", Tahun"+tahun);
    if(hari==tanggal_absen.getDate() && bulan == tanggal_absen.getMonth() && tahun==tanggal_absen.getFullYear()){
      console.log("bisa");
      var jam = new Date(send_data.tanggal).getHours()*60;
      var menit = new Date(send_data.tanggal).getMinutes();
      getOneCollection('user', {"userid":send_data.pin}, (err, result)=>{
        console.log(result);
        var data_user = result[0];
        var param_jam = 450;
        if(result.status_pns!=='undefined' && result.bagian!=='undefined'){
          send_data['waktu'] = param_jam-(jam+menit);
          send_data['nama'] = data_user.name;
          send_data['jabatan'] = data_user.bagian;
          send_data['status_pns'] = data_user.status_pns;
          console.log("Data user", send_data);
          io.emit('absen', send_data);
        }
      })
      
    }
  })
});

router.get('/get-data', (req, res, next)=>{
  
})


router.get('/', function(req, res, next) {
  res.send('s');
});

module.exports = router;
