import React from 'react';
import Chart from 'react-apexcharts';
class GrafikAbsen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }

    render(){
        var data={
            series: [{
                name: 'Telat',
                data: this.props.waktu.telat
            },
            {
                name: 'Cepat',
                data: this.props.waktu.cepat
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
                colors: [this.props.warna.telat, this.props.warna.cepat],
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
                    min: this.props.parameter.telat,
                    max: this.props.parameter.cepat,
                        title: {
                            // text: 'Age',
                        },
                    },
                    title: {
                        text: this.props.title
                    },
                    xaxis: {
                        categories: this.props.pegawai,
                    title: {
                        text: ''
                    },
                    labels: {
                        formatter: function (val) {
                        return Math.abs(Math.round(val))+" m"
                        }
                    }
                },
            },
        }
        return(
            <Chart options={data.option} series={data.series} type="bar" height={350} />
        )
    }

}
export default GrafikAbsen;