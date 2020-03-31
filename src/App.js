import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

//css
import './App.css';

//components
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';

const App = () => {
  return(
    <Router>
      <MainNavigation />
      <main>
      <Switch>
      <Route path="/" exact>
        <Users/>
      </Route>
      <Route path="/:userId/places" exact>
        <UserPlaces/>
      </Route>
      <Route path="/places/new" exact>
        <NewPlace/>
      </Route>
      {/* if the url is going to path which is not exist we can redirect the page to / path by using Redirect */}
      <Redirect to="/" />
      </Switch>
      </main>
    </Router>
  ); 
}

export default App;
