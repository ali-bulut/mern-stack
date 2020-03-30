import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

//css
import './App.css';

//components
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';

const App = () => {
  return(
    <Router>
      <Switch>
      <Route path="/" exact>
        <Users/>
      </Route>
      <Route path="/places/new" exact>
        <NewPlace/>
      </Route>
      {/* if the url is going to path which is not exist we can redirect the page to / path by using Redirect */}
      <Redirect to="/" />
      </Switch>
    </Router>
  ); 
}

export default App;
