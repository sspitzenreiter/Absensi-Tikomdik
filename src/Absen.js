import React from 'react';
import {Container, Row, Col, CardHeader, CardBody, Card, Table} from 'reactstrap';
import io from 'socket.io-client';
import Chart from 'react-apexcharts';
import GrafikAbsen from './GrafikAbsen';
import axios from 'axios';
class Absen extends React.Component{
    constructor(props){
        super(props);
        var jam_telat = -60;
        var jam_cepat = 60;
        var tulisan_position = 'bottom';
        var absen_color = {
          cepat:'#34eb80',
          telat:'#eb4634'
        }
        this.state = {
            belum_datang:[],
            sudah_datang: [],
            tatausaha_pns_data:{
              warna:absen_color,
              parameter:{
                telat:-60,
                cepat:60
              },
              waktu:{
                telat:[0],
                cepat:[0]
              },
              pegawai:['Tidak Ada']
            },
            tatausaha_non_data:{
              warna:absen_color,
              parameter:{
                telat:-60,
                cepat:60
              },
              waktu:{
                telat:[0],
                cepat:[0]
              },
              pegawai:['Tidak Ada']
            },
            produksi_pns_data:{
              warna:absen_color,
              parameter:{
                telat:-60,
                cepat:60
              },
              waktu:{
                telat:[0],
                cepat:[0]
              },
              pegawai:['Tidak Ada']
            },
            produksi_non_data:{
              warna:absen_color,
              parameter:{
                telat:-60,
                cepat:60
              },
              waktu:{
                telat:[0],
                cepat:[0]
              },
              pegawai:['Tidak Ada']
            },
            promosi_pns_data:{
              warna:absen_color,
              parameter:{
                telat:-60,
                cepat:60
              },
              waktu:{
                telat:[0],
                cepat:[0]
              },
              pegawai:['Tidak Ada']
            },
            promosi_non_data:{
              warna:absen_color,
              parameter:{
                telat:-60,
                cepat:60
              },
              waktu:{
                telat:[0],
                cepat:[0]
              },
              pegawai:['Tidak Ada']
            },
        }
        const socket = io('http://192.168.100.95:4000', {
          autoConnect:true
        });
        socket.on('connect', ()=>{
          
        });
        
        socket.on('coba', data=>{
          alert(data);
        })

        socket.on('absen', data=>{
          var index = this.state.belum_datang.indexOf(data.name);
          if(index>-1){
            this.state.belum_datang.splice(index, 1);
          }
          if(this.state.sudah_datang.indexOf(data.name)===-1){
            this.insertDataToGraph(data);
          }
        });
    }

    componentDidMount(){
        
       
        axios.get('http://192.168.100.95:3500/rekap-absen').then((response)=>{
          var data_belum_datang = [];
          var res_belum_datang = response.data.list_rekap_absen.belum_datang;
          for(var i=0;i<res_belum_datang.length;i++){
            if(res_belum_datang[i].bagian!=="1" && res_belum_datang[i].bagian!=="2" && res_belum_datang[i].bagian!=="3" && res_belum_datang[i].bagian!=="4" && res_belum_datang[i].bagian!=="8"){
              data_belum_datang.push(res_belum_datang[i].name);
            }
          }
          data_belum_datang.sort();
          this.setState({belum_datang:data_belum_datang});
          response.data.list_rekap_absen.pergi.forEach((item, i)=>{
            this.insertDataToGraph(item);
            
          })
        }).catch((err)=>{
          console.log(err);
        });
        
       
    }
    
    insertDataToGraph=(data)=>{
      var target = "";
      switch(data.bagian){
        case "6":
          target = "produksi_";
        break;
        case "5":
          target = "promosi_";
        break;
        case "7":
          target = "tatausaha_";
        break;
      }
      if(data.status_pns=="0"){
        target+="non";
      }else{
        target+="pns";
      }
      this.setState(prevState=>{
        return {
          sudah_datang:[...prevState.sudah_datang, data.name]
        }
      })
      data['status_tampil'] = "standar";
      this.setGraphData(target, data);
    }

    setGraph=ev=>{
      
    }

    setGraphData=(graphname,data)=>{
      data['telat'] = 0;
      data['cepat'] = 0;
      if(data.waktu<0){
        data['telat'] = data.waktu;
      }else{
        data['cepat'] = data.waktu;
      }
      switch(graphname){
        case "produksi_pns":
          
          if(this.state.produksi_pns_data.pegawai[0]==="Tidak Ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                produksi_pns_data:{
                  ...prevState.produksi_pns_data,
                  waktu:{
                    telat:[data.telat],
                    cepat:[data.cepat]
                  },
                  pegawai:[data.name]
                }
              }
            })
          }else{
            this.setState(prevState=>{
              return {
                produksi_pns_data:{
                  ...prevState.produksi_pns_data,
                  waktu:{
                    telat:[...prevState.produksi_pns_data.waktu.telat, data.telat],
                    cepat:[...prevState.produksi_pns_data.waktu.cepat, data.cepat]
                  },
                  pegawai:[...prevState.produksi_pns_data.pegawai, data.name]
                }
              }
            })
          }
        break;
        case "produksi_non":
          if(this.state.produksi_non_data.pegawai[0]==="Tidak Ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                produksi_non_data:{
                  ...prevState.produksi_non_data,
                  waktu:{
                    telat:[data.telat],
                    cepat:[data.cepat]
                  },
                  pegawai:[data.name]
                }
              }
            })
          }else{
            this.setState(prevState=>{
              return {
                produksi_non_data:{
                  ...prevState.produksi_non_data,
                  waktu:{
                    telat:[...prevState.produksi_non_data.waktu.telat, data.telat],
                    cepat:[...prevState.produksi_non_data.waktu.cepat, data.cepat]
                  },
                  pegawai:[...prevState.produksi_non_data.pegawai, data.name]
                }
              }
            })
          }
        break;
        case "promosi_pns":
          if(this.state.promosi_pns_data.pegawai[0]==="Tidak Ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                promosi_pns_data:{
                  ...prevState.promosi_pns_data,
                  waktu:{
                    telat:[data.telat],
                    cepat:[data.cepat]
                  },
                  pegawai:[data.name]
                }
              }
            })
          }else{
            this.setState(prevState=>{
              return {
                promosi_pns_data:{
                  ...prevState.promosi_pns_data,
                  waktu:{
                    telat:[...prevState.promosi_pns_data.waktu.telat, data.telat],
                    cepat:[...prevState.promosi_pns_data.waktu.cepat, data.cepat]
                  },
                  pegawai:[...prevState.promosi_pns_data.pegawai, data.name]
                }
              }
            })
          }
        break;
        case "promosi_non":
          if(this.state.promosi_non_data.pegawai[0]==="Tidak Ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                promosi_non_data:{
                  ...prevState.promosi_non_data,
                  waktu:{
                    telat:[data.telat],
                    cepat:[data.cepat]
                  },
                  pegawai:[data.name]
                }
              }
            })
          }else{
            this.setState(prevState=>{
              return {
                promosi_non_data:{
                  ...prevState.promosi_non_data,
                  waktu:{
                    telat:[...prevState.promosi_non_data.waktu.telat, data.telat],
                    cepat:[...prevState.promosi_non_data.waktu.cepat, data.cepat]
                  },
                  pegawai:[...prevState.promosi_non_data.pegawai, data.name]
                }
              }
            })
          }
        break;
        case "tatausaha_pns":
          if(this.state.tatausaha_pns_data.pegawai[0]==="Tidak Ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                tatausaha_pns_data:{
                  ...prevState.tatausaha_pns_data,
                  waktu:{
                    telat:[data.telat],
                    cepat:[data.cepat]
                  },
                  pegawai:[data.name]
                }
              }
            })
          }else{
            this.setState(prevState=>{
              return {
                tatausaha_pns_data:{
                  ...prevState.tatausaha_pns_data,
                  waktu:{
                    telat:[...prevState.tatausaha_pns_data.waktu.telat, data.telat],
                    cepat:[...prevState.tatausaha_pns_data.waktu.cepat, data.cepat]
                  },
                  pegawai:[...prevState.tatausaha_pns_data.pegawai, data.name]
                }
              }
            })
          }
        break;
        case "tatausaha_non":
          if(this.state.tatausaha_non_data.pegawai[0]==="Tidak Ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                tatausaha_non_data:{
                  ...prevState.tatausaha_non_data,
                  waktu:{
                    telat:[data.telat],
                    cepat:[data.cepat]
                  },
                  pegawai:[data.name]
                }
              }
            })
          }else{
            this.setState(prevState=>{
              return {
                tatausaha_non_data:{
                  ...prevState.tatausaha_non_data,
                  waktu:{
                    telat:[...prevState.tatausaha_non_data.waktu.telat, data.telat],
                    cepat:[...prevState.tatausaha_non_data.waktu.cepat, data.cepat]
                  },
                  pegawai:[...prevState.tatausaha_non_data.pegawai, data.name]
                }
              }
            })
          }
          break;
        }
    }

    render(){
        var belum_datang = this.state.belum_datang.map((content, i)=>
           {
             
             return(
              <Col md="3">{content}</Col>
             )
          }
        )
        return(
            <div>
                <Row>
                  <Col><h2 style={{"text-align":'center'}}>Kehadiran</h2></Col>
                </Row>
                <Row>
                  <Col xl="6">
                    <Card>
                      <CardHeader onClick={this.setGraph}>Tata Usaha</CardHeader>
                      <CardBody>
                        <Row>
                          <Col xl="6"><GrafikAbsen title="PNS" warna={this.state.tatausaha_pns_data.warna} waktu={this.state.tatausaha_pns_data.waktu} parameter={this.state.tatausaha_pns_data.parameter} pegawai={this.state.tatausaha_pns_data.pegawai}/></Col>
                          <Col xl="6"><GrafikAbsen title="Non PNS" warna={this.state.tatausaha_non_data.warna} waktu={this.state.tatausaha_non_data.waktu} parameter={this.state.tatausaha_non_data.parameter} pegawai={this.state.tatausaha_non_data.pegawai}/></Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col xl="6">
                    <Card>
                      <CardHeader>Promosi</CardHeader>
                      <CardBody>
                        <Row>
                        <Col xl="6"><GrafikAbsen title="PNS" warna={this.state.promosi_pns_data.warna} waktu={this.state.promosi_pns_data.waktu} parameter={this.state.promosi_pns_data.parameter} pegawai={this.state.promosi_pns_data.pegawai}/></Col>
                          <Col xl="6"><GrafikAbsen title="Non PNS" warna={this.state.promosi_non_data.warna} waktu={this.state.promosi_non_data.waktu} parameter={this.state.promosi_non_data.parameter} pegawai={this.state.promosi_non_data.pegawai}/></Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row> 
                <br/>
                <br/>
                <br/>
               
                <Row>
                  <Col xl="6">
                    <Card>
                      <CardHeader>Produksi</CardHeader>
                      <CardBody>
                        <Row>
                        <Col xl="6"><GrafikAbsen title="PNS" warna={this.state.produksi_pns_data.warna} waktu={this.state.produksi_pns_data.waktu} parameter={this.state.produksi_pns_data.parameter} pegawai={this.state.produksi_pns_data.pegawai}/></Col>
                          <Col xl="6"><GrafikAbsen title="Non PNS" warna={this.state.produksi_non_data.warna} waktu={this.state.produksi_non_data.waktu} parameter={this.state.produksi_non_data.parameter} pegawai={this.state.produksi_non_data.pegawai}/></Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col xl="6">
                    <Card >
                      <CardHeader>Belum datang</CardHeader>
                      <CardBody style={{"height":"450px", "float":"left"}}>
                        <Row>
                        {belum_datang}
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            
        )
    }
}
export default Absen;