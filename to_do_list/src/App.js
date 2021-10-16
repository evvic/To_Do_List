import React from 'react';
import './App.css';

import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import Info from './info';
import Completed from './completed';

class App extends React.Component {
  render() {
    const navClass = 'colors' + this.props.colorModeFromReduxStore;
    return (
      <BrowserRouter>
        <div className="App">
          <nav className={navClass}>
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
            <Route path="/" exact>
              <div><h1>Main Page</h1> Lorem ipsum etc.</div>
            </Route>
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
}

// This function is needed to get data from Redux store 
// to the component as props using connect() of react-redux. 
// Reshape the data from store to a suitable form for the 
// component here.
const mapStateToProps = state => {
  return {
    colorModeFromReduxStore: state['general']['colorMode']
  };
};
const app = connect(mapStateToProps, null)(App)

export default app;