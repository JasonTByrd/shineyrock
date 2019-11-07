import React, { Component } from "react";
import './contact-page-component.css';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';
import contactHeaderImage from '../assets/images/contact-header.jpg';
import axios from 'axios';
import  { Redirect } from 'react-router-dom'

const API_PATH = 'https://shineyrock.org/api/contact/index.php';

class ContactComponent extends Component {

  formState = {
    fname: '',
    lname: '',
    email: '',
    message: '',
    error: null,
    hpot: '',
  }
  close = false;

  componentDidMount() {
    this.props.onConTrue();
    setTimeout(() => {
      this.props.onShow();
    }, 0);
  }

  closeMe = () => {
    if(this.props.show) {
      this.props.onShow();
      // this.setState(this.props.onPause());
      setTimeout(() => {
        this.close = true;
        this.props.onContact();
      }, 1000);
    }
  }

  handleFormSubmit = ( event ) => {
    if(!this.props.mailSent && !this.formState.hpot) {
      event.preventDefault();
      axios({
        method: 'post',
        url: `${API_PATH}`,
        headers: { 'content-type': 'application/json' },
        data: this.formState
      })
      .then(result => {
        this.props.onSent();
      })
      .catch(error => { 
        this.formState.error = error.message 
      });

      setTimeout(() => {
        this.props.onSent();
        document.querySelector('.contact-form').reset();
      }, 5000);
    }
  }

  render() {
    return (
      <div className={!this.props.show ? "contact-page-container" : "contact-page-container show"}>
        {this.close && <Redirect to='/' />}
        <div className="close-me" onClick={e => this.closeMe(e)}>
          <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="window-close" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-window-close fa-w-16 fa-9x"><path fill="currentColor" d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h404c3.3 0 6 2.7 6 6v340zM356.5 194.6L295.1 256l61.4 61.4c4.6 4.6 4.6 12.1 0 16.8l-22.3 22.3c-4.6 4.6-12.1 4.6-16.8 0L256 295.1l-61.4 61.4c-4.6 4.6-12.1 4.6-16.8 0l-22.3-22.3c-4.6-4.6-4.6-12.1 0-16.8l61.4-61.4-61.4-61.4c-4.6-4.6-4.6-12.1 0-16.8l22.3-22.3c4.6-4.6 12.1-4.6 16.8 0l61.4 61.4 61.4-61.4c4.6-4.6 12.1-4.6 16.8 0l22.3 22.3c4.7 4.6 4.7 12.1 0 16.8z" className=""></path></svg>
        </div>
        <section className="contact-header">
          <img src={contactHeaderImage} className="contact-header-image" alt="keyboard-contact header">
          </img>
        </section>

        <section className="contact-content">
          <div className="what-i-do">
            <h1 className="what-i-do-header">
              CONTACT ME
            </h1>
            <p className="what-i-do-text">
              Send me a message if you'd like to learn more about me or any of my projects. I look forward to hearing from you!
            </p>
            <h2 className="what-i-do-header-2">
              Send Me A Message
            </h2>
            <form className="contact-form">
              <input type="text" name="" id="fname" className="name-input input-field" placeholder="First Name *" onChange={e => { this.formState.fname = e.target.value }}/>
              <input type="text" name="" id="lname" className="name-input input-field" placeholder="Last Name" onChange={e => { this.formState.lname = e.target.value }}/>
              <input type="email" name="" id="email" autoCapitalize="none" autoCorrect="off" className="email-input input-field" placeholder="E-mail (example@example.com) *" onChange={e => { this.formState.email = e.target.value }}/>
              <textarea key={new Date()} name="" id="message" className="message-input input-field--multiline" placeholder="Your Message *" onChange={e => { this.formState.message = e.target.value }}></textarea>
              <input type="submit" onClick={e => this.handleFormSubmit(e)} value="Submit" className="submit-input"/>
              <div className="form-message">
                {this.props.mailSent &&
                  <div>Your message has been sent, thank you!</div>
                }
              </div>
              <input type="text" name="" id="break" className="break" placeholder="" onChange={e => { this.formState.hpot = e.target.value }} style={{visibility: 'hidden'}}/>
            </form>
          </div>
        </section>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    contact: state.contact,
    portfolio: state.portfolio,
    about: state.about,
    show: state.show,
    pause: state.pause,
    mailSent: state.mailSent
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPortfolio: () => {
      dispatch({type: actionTypes.ONPORTFOLIO});
    },
    onAbout: () => {
      dispatch({type: actionTypes.ONABOUT});
    },
    onContact: () => {
      dispatch({type: actionTypes.ONCONTACT});
    },
    onShow: () => {
      dispatch({type: actionTypes.ONSHOW});
    },
    onPause: () => {
      dispatch({type: actionTypes.ONPAUSE});
    },
    onSent: () => {
      dispatch({type: actionTypes.ONSENT});
    },
    onConTrue: () => {
      dispatch({type: actionTypes.COTRUE});
    },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ContactComponent);
