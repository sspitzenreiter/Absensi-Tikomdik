import React from 'react';
import { Container, Row, Col, Table, Label } from 'reactstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Form,
    FormGroup,
    Input
} from 'reactstrap';
class User extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            data:[],
            view:'table',
            form:{
                nama:'',
                bagian:'',
                aktivasi:'',
                status_pns:''
            },
            userid:''
        }
        this.selectListener.bind(this);
    }

    componentDidMount(){
        this.getData();
    }
    getData(){
        axios.get('http://192.168.100.95:3500/get-user').then(res=>{
            this.setState({data:res.data});
        });
    }
    cekData=(selector, data)=>{
        var result = data;
        switch(selector){
            case "pns": 
                if(data==="1"){
                    result = "Ya";
                }else{
                    result = "Tidak";
                }
            break;
            case "bagian":
                switch(data){
                    case "1":
                        result = "Kepala Tikomdik";
                    break;
                    case "2":
                        result = "Kasubag Tata Usaha";
                    break;
                    case "3":
                        result = "Kasubag Produksi";
                    break;
                    case "4":
                        result = "Kasubag Promosi";
                    break;
                    case "5":
                        result = "Staff Promosi";
                    break;
                    case "6":
                        result = "Staff Produksi";
                    break;
                    case "7":
                        result = "Staff Tata Usaha";
                    break;
                }
            break;
        }
        return result;
    }

    event_view=(action, data_receive)=>{
        if(action==="insert"){
            this.setState({view:'form'});
        }else if(action==="table"){
           
            this.getData();
            this.setState({view:'table'});
        }else if(action==="update"){
            var data = this.state.data.find(x=>x.userid===data_receive);
            this.setState(
                {
                    view:'form', 
                    form:{
                        name:data.name,
                        bagian:data.bagian,
                        status_pns:data.status_pns,
                        activated:data.activated
                    },
                    userid:data.userid
    
                });
        }
        
    }

    updateUser(){
        axios.post('http://192.168.100.95:3500/update-user',{where:this.state.userid, data:this.state.form}).then(res=>{
            
        })
        this.event_view('table','');
    }
    selectListener=(ev)=>{
        var target = ev.target.name;
        var data = ev.target.value;
        this.setState(prevState=>{return {form:{...prevState.form, [target]:data}}});
    }
    render(){
        const columns = [
            {name:'Nama', selector:'name', sortable:true},
            {name:'Bagian', cell:row=><div>{this.cekData('bagian', row.bagian)}</div>, sortable:true},
            {name:'Status PNS', cell:row=><div>{this.cekData('pns', row.status_pns)}</div>},
            {name:'Aksi', cell:row=><div><Button onClick={ev=>this.event_view('update', row.userid)}>Update</Button></div>},
        ];
        const action = <Button onClick={ev=>this.event_view('insert', '')}>Tambah Data</Button>;
        const view_table = 
                        <DataTable
                            title="Data User"
                            columns={columns}
                            data={this.state.data}
                            pagination
                            actions={action}
                        />;
        const view_form = 
            <Card>
                <CardHeader></CardHeader>
                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label for="nama">Nama : </Label>
                            <Input type="text" value={this.state.form.name} onChange={ev=>this.setState(prevState=>{return {form:{...prevState.form, nama:ev.target.value}}})}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="bagian">Bagian : </Label>
                            <Input type="select" name="bagian" value={this.state.form.bagian} onChange={this.selectListener}>
                                <option value="1" disabled>Kepala Tikomdik</option>
                                <option value="2">Kasubag Tata Usaha</option>
                                <option value="3">Kasubag Produksi</option>
                                <option value="4">Kasubag Promosi</option>
                                <option value="5">Staff Promosi</option>
                                <option value="6">Staff Produksi</option>
                                <option value="7">Staff Tata Usaha</option>
                                <option value="8">Sekuriti</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="status_pns">Status PNS : </Label>
                            <Input type="select" name="status_pns" value={this.state.form.status_pns} onChange={this.selectListener}>
                                <option value="0">Non PNS</option>
                                <option value="1">PNS</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="aktivasi">Aktivasi : </Label>
                            <Input type="select" name="activated" value={this.state.form.activated} onChange={this.selectListener}>
                                <option value="0">Tidak Aktif</option>
                                <option value="1">Aktif</option>
                            </Input>
                        </FormGroup>
                        <Button color="primary" onClick={ev=>this.updateUser()}>Update</Button>
                    </Form>
                </CardBody>
            </Card>
        ;
            
        var view_data = "";
        if(this.state.view==="table"){
            view_data = view_table;
        }else{
            view_data = view_form;
        }  
        return (
            <Container>
                {view_data}
            </Container>
        )
        
    }
}
export default User;