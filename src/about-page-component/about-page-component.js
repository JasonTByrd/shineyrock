import React, { Component } from "react";
import './about-page-component.css';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';

class AboutComponent extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="about-page-container">

      </div>
    )
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(AboutComponent);
