import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import CanvasComponent from './canvas-component/canvas-component.js';
import AboutComponent from './about-page-component/about-page-component.js';
import { connect } from 'react-redux';
import * as actionTypes from './store/actions';

class App extends Component {

  render = () => { return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        <CanvasComponent></CanvasComponent>
      </header>
      {this.props.about && <AboutComponent></AboutComponent>}
    </div>
  ) }
}

const mapStateToProps = state => {
  return {
    about: state.about,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAbout: () => {
      dispatch({type: actionTypes.ONABOUT});
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
