import React from 'react';

import './app.css'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SetupProfileData from './components/SetupProfileData';
import Chat from './components/Chat';


function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={SetupProfileData}></Route>
          <Route path="/chat" exact component={Chat}></Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
