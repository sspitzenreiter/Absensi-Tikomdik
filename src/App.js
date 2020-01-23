import React from 'react';
import logo from './logo.svg';
import './App.css';
import Absen from './Absen';
import Login from './Login';
import AdminView from './AdminView';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
class App extends React.Component {
  constructor(props){
    super(props);
    
  }
  render(){
    return (
      <Router>
        <Switch>
          <Route path="/admin/(video-config|user-config)">
            <AdminView/>
          </Route>
          <Route path="/admin">
            <Login/>
          </Route>
          <Route path="/">
            <Absen/>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
