import React, { Component } from "react";
import './contact-page-component.css';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';

class ContactComponent extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="contact-page-container">

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

export default connect(mapStateToProps, mapDispatchToProps)(ContactComponent);
