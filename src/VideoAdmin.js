import React, {useState} from 'react';
import {
    Button, 
    Card,
    CardHeader, 
    CardBody, 
    Form, 
    FormGroup, 
    Label, 
    Input, 
    Modal, 
    ModalHeader, 
    ModalBody,
    ModalFooter,
    Container
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
class VideoAdmin extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            files:null,
            modal_state:false,
            nama:''
        }
    }
    onFileChange=e=>{
        let files = e.target.files || e.dataTransfer.files;
        if(!files.length){

        }else{
            this.setState({files:files[0]});
        }
    }
    uploadData(){
        const formData = new FormData();
        formData.append('files', this.state.files);
        formData.append('nama', this.state.nama);
        axios.post('http://localhost:3500/submit-form', formData, {
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        }).then((res)=>{

        });
    }
    toggle = () => {
        this.setState({nama:''})
        this.setState({
            modal_state:!this.state.modal_state
        })
    };
    render(){
        const columns = [
            
        ];
        const action = <Button onClick={this.toggle}>Tambah Data</Button>;
        const view_table = 
                        <DataTable
                            title="Data User"
                            columns={columns}
                            data={this.state.data}
                            pagination
                            actions={action}
                        />;
        const view_form = 
                <Form>
                    <FormGroup>
                        <Label for="nama" value={this.state.nama} onChange={ev=>this.setState({nama:ev.target.value})}>Nama : </Label>
                        <Input type="text" />
                    </FormGroup>
                    <FormGroup>
                        <Input type="file" onChange={this.onFileChange}/>
                    </FormGroup>
                    
                </Form>
                ;
        return(
            <Container>
                <Modal isOpen={this.state.modal_state} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        {view_form}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={ev=>this.uploadData()}>Tambah</Button>
                    </ModalFooter>
                </Modal>
                {view_table}
            </Container>
        )
    }
}

export default VideoAdmin;