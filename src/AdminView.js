import React from 'react';
import User from './User';
import VideoAdmin from './VideoAdmin';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
class AdminView extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Router>
                <Switch> 
                    <Route path="/admin/user-config">
                        <User/>
                    </Route>
                    <Route path="/admin/video-config">
                        <VideoAdmin/>
                    </Route>
                </Switch>
            </Router>
        )
        
    }
}

export default AdminView;