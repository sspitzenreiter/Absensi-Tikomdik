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
            
            config_produksi_pns:{
              series: [{
                name: 'Telat',
                data: [0]
              },
              {
                name: 'Cepat',
                data: [0]
              }
              ],
              option: {
                chart: {
                  type: 'bar',
                  height: 440,
                  stacked: true,
                  toolbar: {
                    show: false
                  }
                },
                colors: [absen_color.telat, absen_color.cepat],
                plotOptions: {
                  bar: {
                    dataLabels:{
                      position:'bottom'
                    },
                    horizontal: true,
                    barHeight: '80%',
                    formatter: (val, opt)=> {
                      return val
                    }
                  }
                },
                yaxis: {
                  min: jam_telat,
                  max: jam_cepat,
                  title: {
                    // text: 'Age',
                  },
                },
                title: {
                  text: 'PNS'
                },
                xaxis: {
                  categories: ['Tidak ada'],
                  title: {
                    text: ''
                  },
                  labels: {
                    formatter: function (val) {
                      return Math.abs(Math.round(val))
                    }
                  }
                },
              },
            },
            config_produksi_non:{
              series: [{
                name: 'Telat',
                data: [0]
              },
              {
                name: 'Cepat',
                data: [0]
              }
              ],
              option: {
                chart: {
                  type: 'bar',
                  height: 440,
                  stacked: true,
                  toolbar: {
                    show: false
                  }
                },
                colors: [absen_color.telat, absen_color.cepat],
                plotOptions: {
                  bar: {
                    horizontal: true,
                    barHeight: '80%',
                    dataLabels:{
                      position:'bottom'
                    },
                  },
                },
                yaxis: {
                  min: jam_telat,
                  max: jam_cepat,
                  title: {
                    // text: 'Age',
                  },
                },
                title: {
                  text: 'Non PNS'
                },
                xaxis: {
                  categories: ['Tidak ada'],
                  title: {
                    text: ''
                  },
                  labels: {
                    formatter: function (val) {
                      return Math.abs(Math.round(val))
                    }
                  }
                },
              },
            },
            config_tatausaha_pns:{
              series: [{
                name: 'Telat',
                data: [0]
              },
              {
                name: 'Cepat',
                data: [0]
              }
              ],
              option: {
                chart: {
                  type: 'bar',
                  height: 440,
                  stacked: true,
                  toolbar: {
                    show: false
                  }
                },
                colors: [absen_color.telat, absen_color.cepat],
                plotOptions: {
                  bar: {
                    horizontal: true,
                    barHeight: '80%',
                    dataLabels:{
                      position:'bottom'
                    },
                  },
                },
                yaxis: {
                  min: jam_telat,
                  max: jam_cepat,
                  title: {
                    // text: 'Age',
                  },
                },
                title: {
                  text: 'PNS'
                },
                xaxis: {
                  categories: ['Tidak ada'],
                  title: {
                    text: ''
                  },
                  labels: {
                    formatter: function (val) {
                      return Math.abs(Math.round(val))
                    }
                  }
                },
              },
            },
            config_tatausaha_non:{
              series: [{
                name: 'Telat',
                data: [0]
              },
              {
                name: 'Cepat',
                data: [0]
              }
              ],
              option: {
                chart: {
                  type: 'bar',
                  height: 440,
                  stacked: true,
                  toolbar: {
                    show: false
                  }
                },
                colors: [absen_color.telat, absen_color.cepat],
                plotOptions: {
                  bar: {
                    horizontal: true,
                    barHeight: '80%',
                    dataLabels:{
                      position:'bottom'
                    },
                  },
                },
                yaxis: {
                  min: jam_telat,
                  max: jam_cepat,
                  title: {
                    // text: 'Age',
                  },
                },
                title: {
                  text: 'Non PNS'
                },
                xaxis: {
                  categories: ['Tidak ada'],
                  title: {
                    text: ''
                  },
                  labels: {
                    formatter: function (val) {
                      return Math.abs(Math.round(val))
                    }
                  }
                },
              },
            },
            config_promosi_pns:{
              series: [{
                name: 'Telat',
                data: [0]
              },
              {
                name: 'Cepat',
                data: [0]
              }
              ],
              option: {
                chart: {
                  type: 'bar',
                  height: 440,
                  stacked: true,
                  toolbar: {
                    show: false
                  }
                },
                colors: [absen_color.telat, absen_color.cepat],
                plotOptions: {
                  bar: {
                    horizontal: true,
                    barHeight: '80%',
                    dataLabels:{
                      position:'bottom'
                    },
                  },
                },
                yaxis: {
                  min: jam_telat,
                  max: jam_cepat,
                  title: {
                    // text: 'Age',
                  },
                },
                title: {
                  text: 'PNS'
                },
                xaxis: {
                  categories: ['Tidak ada'],
                  title: {
                    text: ''
                  },
                  labels: {
                    formatter: function (val) {
                      return Math.abs(Math.round(val))
                    }
                  }
                },
              },
            },
            config_promosi_non:{
              series: [{
                name: 'Telat',
                data: [0]
              },
              {
                name: 'Cepat',
                data: [0]
              }
              ],
              option: {
                chart: {
                  type: 'bar',
                  height: 440,
                  stacked: true,
                  toolbar: {
                    show: false
                  }
                },
                colors: [absen_color.telat, absen_color.cepat],
                plotOptions: {
                  bar: {
                    horizontal: true,
                    barHeight: '80%',
                    dataLabels:{
                      position:'bottom'
                    },
                  },
                },
                yaxis: {
                  min: jam_telat,
                  max: jam_cepat,
                  title: {
                    // text: 'Age',
                  },
                },
                title: {
                  text: 'Non PNS'
                },
                xaxis: {
                  categories: ['Tidak ada'],
                  title: {
                    text: ''
                  },
                  labels: {
                    formatter: function (val) {
                      return Math.abs(Math.round(val))
                    }
                  }
                },
              },
            }
        }
    }

    componentDidMount(){
        
        const socket = io('http://localhost:4000', {
            autoConnect:true
        });
        axios.get('http://localhost:3500/rekap-absen').then((response)=>{
          
          response.data.data_rekap.forEach((item, i)=>{
            this.insertDataToGraph(item);
            
          })
        }).catch((err)=>{
          console.log(err);
        });
        socket.on('connect', ()=>{
          
        });
        
        socket.on('absen', data=>{
          this.insertDataToGraph(data);
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
          if(this.state.produksi_pns_data.pegawai[0]==="Tidak ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                promosi_pns_data:{
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
          if(this.state.produksi_non_data.pegawai[0]==="Tidak ada" || data.status_tampil == "reset" ){
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
          if(this.state.promosi_pns_data.pegawai[0]==="Tidak ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                promosi_non_data:{
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
                promosi_non_data:{
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
          if(this.state.promosi_non_data.pegawai[0]==="Tidak ada" || data.status_tampil == "reset" ){
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
          if(this.state.tatausaha_pns_data.pegawai[0]==="Tidak ada" || data.status_tampil == "reset" ){
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
          if(this.state.tatausaha_non_data.pegawai[0]==="Tidak ada" || data.status_tampil == "reset" ){
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
        return(
            <div>
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
                    <Card>
                      <CardHeader>Yang belum datang</CardHeader>
                      <CardBody>
                        qiofqofqwoi
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            
        )
    }
}
export default Absen;