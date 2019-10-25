import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import CanvasComponent from './canvas-component/canvas-component.js';
import AboutComponent from './about-page-component/about-page-component.js';
import PortfolioComponent from './portfolio-page-component/portfolio-page-component.js';
import ContactComponent from './contact-page-component/contact-page-component.js';
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
      {this.props.portfolio && <PortfolioComponent></PortfolioComponent>}
      {this.props.contact && <ContactComponent></ContactComponent>}
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
