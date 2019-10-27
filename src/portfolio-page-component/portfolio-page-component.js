import React, { Component } from "react";
import './portfolio-page-component.css';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';

class PortfolioComponent extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="portfolio-page-container">

      </div>
    )
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioComponent);
