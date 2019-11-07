import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import CanvasComponent from './canvas-component/canvas-component.js';
import { connect } from 'react-redux';
import * as actionTypes from './store/actions';
import  { Redirect } from 'react-router-dom'

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
      {this.props.about && <Redirect to='/about' />}
      {this.props.portfolio && <Redirect to='/portfolio' />}
      {this.props.contact && <Redirect to='/contact' />}
    </div>
  ) }
}

const mapStateToProps = state => {
  return {
    about: state.about,
    portfolio: state.portfolio,
    contact: state.contact,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAbout: () => {
      dispatch({type: actionTypes.ONABOUT});
    },
    onPortfolio: () => {
      dispatch({type: actionTypes.ONPORTFOLIO});
    },
    onContact: () => {
      dispatch({type: actionTypes.ONCONTACT});
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
