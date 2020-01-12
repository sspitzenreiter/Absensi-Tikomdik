var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var mongo = require("mongodb");
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";
const ZKLib = require('zklib');
const axios = require('axios');
var async = require('async')
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
var belum_datang = [];
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
    if(err) {
      console.log(err);
      throw err;
    };
    var dbo = db.db("AbsenTikomdik");
    var tanggal_server = new Date();
    var hari = tanggal_server.getDate();
    var bulan = tanggal_server.getMonth()+1;
    var tahun = tanggal_server.getFullYear();
    if(hari<10){
      hari = "0"+hari;
    }
    if(bulan<10){
      bulan = "0"+bulan;
    }
    //console.log(hari+"-"+bulan+"-"+tahun);
    var tanggal_cari = hari+"-"+bulan+"-"+tahun;
    dbo.collection('kedatangan').aggregate(
      [
        {$addFields:{
          tanggal_real:{
            $dateToString:{
              format:"%d-%m-%Y",
              date:'$tanggal',
              timezone:'Asia/Bangkok'
            }
          },
          jam:{
            $dateToString:{
              format:'%H:%M:%S',
              date:'$tanggal',
              timezone:'Asia/Bangkok'
            }
          }
        }}, {$match:{tanggal_real:tanggal_cari}}
        
      ]).toArray((err, result)=>{
      if(err){
        console.log(err);
        throw err;
      } 
      //console.log("result trace",result);
      callback(err, result);
      db.close();
    });
  });
}

getOneCollection=(doc, where, callback)=>{
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log(err);
      throw err;
    };
    var dbo = db.db("AbsenTikomdik");
    // dbo.createCollection(doc, function(err, res) {
    //   if (err) throw err;
    //   console.log("Collection created!");
    // });
    dbo.collection(doc).find(where).toArray((err, result)=>{
      if(err){
        console.log(err);
        throw err;
      };
      callback(err, result);
      db.close();
    });
  });
}

router.get('/raw-data', (req, res, next)=>{
  var data = req.query;
  getCollection(data.table, {}, (result)=>{
    res.send(result);
  })
})

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
  belum_datang = [];
  getKedatangan((err, result_kedatangan)=>{
    result_kedatangan.forEach((data,i)=>{
      var send_data = result_kedatangan[i];
      var tanggal_absen = new Date(data.tanggal);
      //console.log("bisa", send_data);
      var waktu = send_data.jam.split(':');
      var jam = parseInt(waktu[0])*60;
      var menit = parseInt(waktu[1]);
      getOneCollection('user', {"userid":send_data.pin}, (err, result)=>{
        //console.log(err);
        var data_user = result[0];
        var param_jam = 450;
       //console.log('Data before modified', send_data);
        if(result.status_pns!=='undefined' && result.bagian!=='undefined'){
          send_data['waktu'] = param_jam-(jam+menit);
          send_data['nama'] = data_user.name;
          send_data['jabatan'] = data_user.bagian;
          send_data['status_pns'] = data_user.status_pns;
          console.log("Data user", send_data);
          //io.emit('absen', send_data);
        }else if(result.length<1){
          belum_datang.push({nama:send_data.name, pin:send_data.pin});
          //io.emit('absen', send_data); 

        }else{
          delete result_kedatangan[i];
        }
        if(i===result_kedatangan.length-1){
          res.send(result_kedatangan);
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
  // if(new Date().getHours()==12){
  //   // axios.get("http://localhost/attend/PHP-soap-baru/clear-data.php?ip=192.168.100.41&key=0").then((clear_responden)=>{
      
  //   //     //res.send('Sukses');
  //   // });
  // }
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
  

  res.send(belum_datang);
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
        console.log("User",result);
        var data_user = result[0];
        var param_jam = 450;
        if(result.status_pns!=='undefined' && result.bagian!=='undefined'){
          send_data['waktu'] = param_jam-(jam+menit);
          send_data['name'] = data_user.name;
          send_data['bagian'] = data_user.bagian;
          send_data['status_pns'] = data_user.status_pns;
          console.log("Data user", send_data);
          io.emit('absen', send_data);
        }
      })
      
    }
  })
});

router.get('/get-data', (req, res, next)=>{
  io.emit('coba', 's');
})


router.get('/', function(req, res, next) {
  res.send('s');
});

router.get('/rekap-absen', (req, res, next)=>{
  //res.send('Data Requested');
  var data = req.query;
  var search_query = {};
  if(typeof data.status_pns!=='undefined'){
    search_query={
      status_pns:data.status_pns
    }
  }
  if(typeof data.bagian!=='undefined'){
    search_query={
      ...search_query,
      bagian:data.bagian
    }
  }
  
  async.waterfall([
    (callback)=>{
      getKedatangan((err, result)=>{
        callback(null, result);
      })
    },(result,callback)=>{
      var data_pergi = [];
      var data_pulang = [];
      for(var a=0;a<result.length;a++){
        var param_jam_pergi = 450;
        var param_jam_pulang = 960;
        var data = result[a];
        var waktu = data.jam.split(':');
        var jam = parseInt(waktu[0])*60;
        var menit = parseInt(waktu[1]);
        data['waktu'] = param_jam_pergi-(parseInt(jam)+parseInt(menit));
        var get = {...data_pergi.find(x=>x.pin===data.pin)};
        console.log(get);
        if(Object.keys(get)<1){
          data_pergi.push(data);
        }else{
          data['waktu'] = (param_jam_pulang-(parseInt(jam)+parseInt(menit)))*-1;
          data_pulang.push(data);
        }
      }
      //console.log("Data pulang",data_pergi)
      callback(null, {pergi:data_pergi, pulang:data_pulang});
    },(result, callback)=>{
      //console.log(Object.values(result.pergi.map(value=>value.pin)));
      var finished_process = {
        belum_datang:[],
        pergi:[],
        pulang:[]
      };
      async.waterfall([
        (callback)=>{
          // console.log({"userid":{"$in":Object.values(result.pergi.map(value=>value.pin))}, ...search_query});
          getCollection('user',  {...search_query}, (result_data)=>{
            //res.send(result_data);
            
            callback(null, result_data);
          })
        },(result_sub, callback)=>{
          result_sub.forEach((item, i)=>{
           delete item._id;
           //console.log(result);
           var data = {};
           var pergi = {...result.pergi.find(x=>x.pin===item.userid)};
           var pulang = {...result.pulang.find(x=>x.pin===item.userid)};
            if(Object.keys(pergi).length>0){
              delete pergi._id;
              finished_process['pergi'].push({...item,...pergi});
              if(Object.keys(pulang).length>0){
                delete pulang._id;
                finished_process['pulang'].push({...item, ...pulang});
              }
            }else{
              if(item.name!==undefined){
                finished_process['belum_datang'].push(item);
              }
            } 
            
            console.log(data);
            //finished_process.push(data);
            if(i===result_sub.length-1){
              callback(null);
            }
            
          })
        },(callback)=>{
          res.send({list_rekap_absen:finished_process});
        }
      ])
    }
  ])
})

module.exports = router;
