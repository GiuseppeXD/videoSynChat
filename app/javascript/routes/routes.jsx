import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from '../components/home';
import Room from '../components/room';

const Routes = () => {
  return (
    <Router>
      <Route component={Home} exact path='/'/>
      <Route component={Room} path='/room/:id'/>
    </Router>
  );
}

export default Routes;