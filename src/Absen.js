import React from 'react';
import {Container, Row, Col, CardHeader, CardBody, Card} from 'reactstrap';
import io from 'socket.io-client';
class Absen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tanggal_absen:'',
            nama:''
        }

        const setAbsensi=(tanggal_absen, nama)=>{
            this.setState({
                tanggal_absen:tanggal_absen,
                nama:nama
            })
        }
        const socket = io('http://localhost:4000');
        socket.on('connect', ()=>{
            
        });
        
        socket.on('absen', data=>setAbsensi(data.tanggal_absen, data.nama));
    }

    render(){
        return(
            <Container className="mt-4">
                <Row>
                    <Col sm="12" md={{size: 6, offset: 3}} xs={{size: 6, offset: 3}}>
                        <Card>
                            <CardHeader>asfasf</CardHeader>
                            <CardBody>
                                <p>Tanggal Absen : {this.state.tanggal_absen}</p>
                                <p>Nama : {this.state.nama} </p>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            
        )
    }
}
export default Absen;