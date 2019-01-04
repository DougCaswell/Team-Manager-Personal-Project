import React, { Component } from 'react';
import { HashRouter } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import routes from './routes';


class App extends Component {
  render() {
    return (
      <HashRouter>
        <div className="App">
          <NavBar />
          {routes}
        </div>
      </HashRouter>
    )
  }
}

export default App;
