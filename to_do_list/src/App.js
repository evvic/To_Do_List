import React from 'react';
import './App.css';

import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import Info from './pages/info';
import TaskPage from './pages/taskpage';
import CompletedPage from './pages/completedpage';

function App()  {

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
            <Route path="/completed" component={CompletedPage} />
            <Route path="/info" component={Info} />
            <Route path="/">
              <h1>Do not do that!</h1>
            </Route>
          </Switch>
        </div>
        {/* temporary way to add extra "white" space at the end of the list */}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </BrowserRouter>
    );
}

export default App;