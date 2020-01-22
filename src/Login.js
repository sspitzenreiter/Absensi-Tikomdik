import React from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Label,
    Input,
    Button
} from 'reactstrap';
import {Redirect} from 'react-router-dom';

class Login extends React.Component{
    constructor(props){
        super(props);

        this.state={
            user:'',
            pass:'',
            logged_in:'0'
        }
    }

    login=(ev)=>{
        if(this.state.user==="admin" && this.state.pass==="admin"){
            sessionStorage.setItem('logged_in', true);
            this.setState({logged_in:'1'});
            
        }
    }

    render(){
        if(this.state.logged_in==="1"){
            return <Redirect to="/user-config" push/>;
        }
        return(
            <Container >
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <Row className="mt-5">
                    <Col md="4"></Col>
                    <Col md="4">
                        <Card>
                            <CardHeader>Login Admin</CardHeader>
                            <CardBody>
                                <FormGroup>
                                    <Label for="username">Username : </Label>
                                    <Input type="text" name="user" value={this.state.user} onChange={ev=>this.setState({user:ev.target.value})}/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="username">Password : </Label>
                                    <Input type="password" name="pass" value={this.state.pass} onChange={ev=>this.setState({pass:ev.target.value})}/>
                                </FormGroup>
                                <Button color="primary" onClick={this.login}>Login</Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default Login;