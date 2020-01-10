import React from 'react';
import {Container, Row, Col, CardHeader, CardBody, Card, Table} from 'reactstrap';
import io from 'socket.io-client';
import Chart from 'react-apexcharts';
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
            series: [{
              name: 'Males',
              data: [0.4, 0.65, 0.76, 0.88, 1.5, 2.1, 2.9, 3.8, 3.9, 4.2, 4, 4.3, 4.1, 4.2, 4.5,
                3.9, 3.5, 3
              ]
            },
            {
              name: 'Females',
              data: [-0.8, -1.05, -1.06, -1.18, -1.4, -2.2, -2.85, -3.7, -3.96, -4.22, -4.3, -4.4,
                -4.1, -4, -4.1, -3.4, -3.1, -2.8
              ]
            }
            ],
            options: {
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
                    position:tulisan_position
                  }
                },
              },
              stroke: {
                width: 1,
                colors: ["#fff"]
              },
              yaxis: {
                min: -5,
                max: 5,
                title: {
                  // text: 'Age',
                },
              },
              title: {
                text: 'PNS'
              },
              xaxis: {
                categories: ['85+', '80-84', '75-79', '70-74', '65-69', '60-64', '55-59', '50-54',
                  '45-49', '40-44', '35-39', '30-34', '25-29', '20-24', '15-19', '10-14', '5-9',
                  '0-4'
                ],
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
        const setAbsensi=(data)=>{
            var set_data = this.state.data_absen;
            var tanggal = new Date(data.tanggal);
            var jam = tanggal.getHours();
            var menit = tanggal.getMinutes();
            var param_jam = 16;
            if(jam>=param_jam){
                var jam_telat = jam-param_jam;
                var menit_telat = menit;
                data['info_datang']="Telat "+jam_telat+" jam "+menit_telat+" menit";
            }
            if(set_data.length>=10){
                set_data.unshift(data);
                set_data.pop();
            }else{
                if(set_data.length>0){
                    set_data.unshift(data);
                }else{
                    set_data.push(data);
                }
            }
            this.setState({data_absen:set_data});
        }
        const socket = io('http://localhost:4000', {
            autoConnect:true
        });
        axios.get('http://localhost:3500/show-kedatangan').then((response)=>{
          
          response.data.forEach((item, i)=>{
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
      switch(data.jabatan){
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
          if(this.state.config_produksi_pns.option.xaxis.categories[0]=="Tidak ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                config_produksi_pns:{
                  option:{
                    ...prevState.config_produksi_pns.option,
                    xaxis:{
                      categories: [data.nama],
                      title: {
                        text: ''
                      },
                      labels: {
                        formatter: function (val) {
                          return Math.abs(Math.round(val))
                        }
                      }
                    }
                  },
                  series: [{
                    name: 'Telat',
                    data: [data.telat]
                  },
                  {
                    name: 'Cepat',
                    data: [data.cepat]
                  }]
                }
              }
            })
          }else{
            this.setState(prevState=>{
              return {
                config_produksi_pns:{
                  option:{
                    ...prevState.config_produksi_pns.option,
                    xaxis:{
                      categories: [...prevState.config_produksi_pns.option.xaxis.categories, data.nama],
                      title: {
                        text: ''
                      },
                      labels: {
                        formatter: function (val) {
                          return Math.abs(Math.round(val))
                        }
                      }
                    }
                  },
                  series: [{
                    name: 'Telat',
                    data: [...prevState.config_produksi_pns.series[0].data, data.telat]
                  },
                  {
                    name: 'Cepat',
                    data: [...prevState.config_produksi_pns.series[1].data, data.cepat]
                  }]
                }
              }
            })
          }
        break;
        case "produksi_non":
          if(this.state.config_produksi_non.option.xaxis.categories[0]=="Tidak ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                config_produksi_non:{
                  option:{
                    ...prevState.config_produksi_non.option,
                    xaxis:{
                      categories: [data.nama],
                      title: {
                        text: ''
                      },
                      labels: {
                        formatter: function (val) {
                          return Math.abs(Math.round(val))
                        }
                      }
                    }
                  },
                  series: [{
                    name: 'Telat',
                    data: [data.telat]
                  },
                  {
                    name: 'Cepat',
                    data: [data.cepat]
                  }]
                }
              }
            })
          }else{
            this.setState(prevState=>{
              return {
                config_produksi_non:{
                  option:{
                    ...prevState.config_produksi_non.option,
                    xaxis:{
                      categories: [...prevState.config_produksi_non.option.xaxis.categories, data.nama],
                      title: {
                        text: ''
                      },
                      labels: {
                        formatter: function (val) {
                          return Math.abs(Math.round(val))
                        }
                      }
                    }
                  },
                  series: [{
                    name: 'Telat',
                    data: [...prevState.config_produksi_non.series[0].data, data.telat]
                  },
                  {
                    name: 'Cepat',
                    data: [...prevState.config_produksi_non.series[1].data, data.cepat]
                  }]
                }
              }
            })
          }
        break;
        case "promosi_pns":
          if(this.state.config_promosi_pns.option.xaxis.categories[0]=="Tidak ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                config_promosi_pns:{
                  option:{
                    ...prevState.config_promosi_pns.option,
                    xaxis:{
                      categories: [data.nama],
                      title: {
                        text: ''
                      },
                      labels: {
                        formatter: function (val) {
                          return Math.abs(Math.round(val))
                        }
                      }
                    }
                  },
                  series: [{
                    name: 'Telat',
                    data: [data.telat]
                  },
                  {
                    name: 'Cepat',
                    data: [data.cepat]
                  }]
                }
              }
            })
          }else{
            this.setState(prevState=>{
              return {
                config_promosi_pns:{
                  option:{
                    ...prevState.config_promosi_pns.option,
                    xaxis:{
                      categories: [...prevState.config_promosi_pns.option.xaxis.categories, data.nama],
                      title: {
                        text: ''
                      },
                      labels: {
                        formatter: function (val) {
                          return Math.abs(Math.round(val))
                        }
                      }
                    }
                  },
                  series: [{
                    name: 'Telat',
                    data: [...prevState.config_promosi_pns.series[0].data, data.telat]
                  },
                  {
                    name: 'Cepat',
                    data: [...prevState.config_promosi_pns.series[1].data, data.cepat]
                  }]
                }
              }
            })
          }
        break;
        case "promosi_non":
          if(this.state.config_promosi_non.option.xaxis.categories[0]=="Tidak ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                config_promosi_non:{
                  option:{
                    ...prevState.config_promosi_non.option,
                    xaxis:{
                      categories: [data.nama],
                      title: {
                        text: ''
                      },
                      labels: {
                        formatter: function (val) {
                          return Math.abs(Math.round(val))
                        }
                      }
                    }
                  },
                  series: [{
                    name: 'Telat',
                    data: [data.telat]
                  },
                  {
                    name: 'Cepat',
                    data: [data.cepat]
                  }]
                }
              }
            })
          }else{
            this.setState(prevState=>{
              return {
                config_promosi_non:{
                  option:{
                    ...prevState.config_promosi_non.option,
                    xaxis:{
                      categories: [...prevState.config_promosi_non.option.xaxis.categories, data.nama],
                      title: {
                        text: ''
                      },
                      labels: {
                        formatter: function (val) {
                          return Math.abs(Math.round(val))
                        }
                      }
                    }
                  },
                  series: [{
                    name: 'Telat',
                    data: [...prevState.config_promosi_non.series[0].data, data.telat]
                  },
                  {
                    name: 'Cepat',
                    data: [...prevState.config_promosi_non.series[1].data, data.cepat]
                  }]
                }
              }
            })
          }
        break;
        case "tatausaha_pns":
          if(this.state.config_tatausaha_pns.option.xaxis.categories[0]=="Tidak ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                config_tatausaha_pns:{
                  option:{
                    ...prevState.config_tatausaha_pns.option,
                    xaxis:{
                      categories: [data.nama],
                      title: {
                        text: ''
                      },
                      labels: {
                        formatter: function (val) {
                          return Math.abs(Math.round(val))
                        }
                      }
                    }
                  },
                  series: [{
                    name: 'Telat',
                    data: [data.telat]
                  },
                  {
                    name: 'Cepat',
                    data: [data.cepat]
                  }]
                }
              }
            })
          }else{
            this.setState(prevState=>{
              return {
                config_tatausaha_pns:{
                  option:{
                    ...prevState.config_tatausaha_pns.option,
                    xaxis:{
                      categories: [...prevState.config_tatausaha_pns.option.xaxis.categories, data.nama],
                      title: {
                        text: ''
                      },
                      labels: {
                        formatter: function (val) {
                          return Math.abs(Math.round(val))
                        }
                      }
                    }
                  },
                  series: [{
                    name: 'Telat',
                    data: [...prevState.config_tatausaha_pns.series[0].data, data.telat]
                  },
                  {
                    name: 'Cepat',
                    data: [...prevState.config_tatausaha_pns.series[1].data, data.cepat]
                  }]
                }
              }
            })
          }
        break;
        case "tatausaha_non":
          if(this.state.config_tatausaha_non.option.xaxis.categories[0]=="Tidak ada" || data.status_tampil == "reset" ){
            this.setState(prevState=>{
              return {
                config_tatausaha_non:{
                  option:{
                    ...prevState.config_tatausaha_non.option,
                    xaxis:{
                      categories: [data.nama],
                      title: {
                        text: ''
                      },
                      labels: {
                        formatter: function (val) {
                          return Math.abs(Math.round(val))
                        }
                      }
                    }
                  },
                  series: [{
                    name: 'Telat',
                    data: [data.telat]
                  },
                  {
                    name: 'Cepat',
                    data: [data.cepat]
                  }]
                }
              }
            })
          }else{
            this.setState(prevState=>{
              return {
                config_tatausaha_non:{
                  option:{
                    ...prevState.config_tatausaha_non.option,
                    xaxis:{
                      categories: [...prevState.config_tatausaha_non.option.xaxis.categories, data.nama],
                      title: {
                        text: ''
                      },
                      labels: {
                        formatter: function (val) {
                          return Math.abs(Math.round(val))
                        }
                      }
                    }
                  },
                  series: [{
                    name: 'Telat',
                    data: [...prevState.config_tatausaha_non.series[0].data, data.telat]
                  },
                  {
                    name: 'Cepat',
                    data: [...prevState.config_tatausaha_non.series[1].data, data.cepat]
                  }]
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
                          <Col xl="6"><Chart options={this.state.config_tatausaha_pns.option} series={this.state.config_tatausaha_pns.series} type="bar" height={350} /></Col>
                          <Col xl="6"><Chart options={this.state.config_tatausaha_non.option} series={this.state.config_tatausaha_non.series} type="bar" height={350} /></Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col xl="6">
                    <Card>
                      <CardHeader>Promosi</CardHeader>
                      <CardBody>
                        <Row>
                          <Col xl="6"><Chart options={this.state.config_promosi_pns.option} series={this.state.config_promosi_pns.series} type="bar" height={350} /></Col>
                          <Col xl="6"><Chart options={this.state.config_promosi_non.option} series={this.state.config_promosi_non.series} type="bar" height={350} /></Col>
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
                          <Col xl="6"><Chart options={this.state.config_produksi_pns.option} series={this.state.config_produksi_pns.series} type="bar" height={350} /></Col>
                          <Col xl="6"><Chart options={this.state.config_produksi_non.option} series={this.state.config_produksi_non.series} type="bar" height={350} /></Col>
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