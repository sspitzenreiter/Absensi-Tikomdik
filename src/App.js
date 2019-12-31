import React from 'react';
import logo from './logo.svg';
import './App.css';
import Absen from './Absen';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Absen/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
