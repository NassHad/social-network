import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import Home from "../../pages/Home";
import Profile from "../../pages/Profile";
import Trending from "../../pages/Trending";
import Navbar from "../Navbar"

const index = () => {
  return (
        <Router>
          <Navbar />
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/profile" exact component={Profile}/>
            <Route path="/trending" exact component={Trending}/>
            <Redirect to="/"/>
          </Switch>
        </Router>
  );
};

export default index;
