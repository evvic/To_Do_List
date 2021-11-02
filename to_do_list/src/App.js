import React, { useState, useEffect } from 'react';
import './App.css';

import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
//import {connect} from 'react-redux';
import Info from './info';
import Completed from './completed/completed';
import TaskPage from './tasks/taskpage';
import Tags from './tasks/tags';

function App()  {


    //const navClass = 'colors' + this.props.colorModeFromReduxStore;

    return (
      <BrowserRouter>
        <div className="App">
          <nav className='navbar'>
            <ul>
              <li className="nav-item">
                <Link to="/">Tasks</Link>
              </li>
              <li className="nav-item">
                <Link to="/completed">Completed</Link>
              </li>
              <li className="last-nav-item">
                <Link to="/info">Info</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path="/" exact component={TaskPage} />
            <Route path="/completed" component={Completed} />
            <Route path="/info" component={Info} />
            <Route path="/">
              <h1>Do not do that!</h1>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
}

export default App;