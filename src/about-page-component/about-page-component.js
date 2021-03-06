import React, { Component } from "react";
import './about-page-component.css';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';
import aboutHeaderImage from '../assets/images/about-header-2.jpg';
import  { Redirect } from 'react-router-dom'

class AboutComponent extends Component {
  
  close = false;

  componentDidMount() {
    this.props.onAbTrue();
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
        this.props.onAbout();
      }, 1000);
    }
  }

  render() {
    return (
      <div className={!this.props.show ? "about-page-container" : "about-page-container show"}>
        {this.close && <Redirect to='/' />}
        <div className="close-me" onClick={e => this.closeMe(e)}>
          <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="window-close" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-window-close fa-w-16 fa-9x"><path fill="currentColor" d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h404c3.3 0 6 2.7 6 6v340zM356.5 194.6L295.1 256l61.4 61.4c4.6 4.6 4.6 12.1 0 16.8l-22.3 22.3c-4.6 4.6-12.1 4.6-16.8 0L256 295.1l-61.4 61.4c-4.6 4.6-12.1 4.6-16.8 0l-22.3-22.3c-4.6-4.6-4.6-12.1 0-16.8l61.4-61.4-61.4-61.4c-4.6-4.6-4.6-12.1 0-16.8l22.3-22.3c4.6-4.6 12.1-4.6 16.8 0l61.4 61.4 61.4-61.4c4.6-4.6 12.1-4.6 16.8 0l22.3 22.3c4.7 4.6 4.7 12.1 0 16.8z" className=""></path></svg>
        </div>
        <section className="about-header">
          <img src={aboutHeaderImage} className="about-header-image" alt="keyboard-about header">
          </img>
        </section>

        <section className="about-content">
          <div className="what-i-do">
            <h1 className="what-i-do-header">
              WHAT I DO
            </h1>
            <p className="what-i-do-text">
              I am a front-end developer and/or software engineer stationed and working professionally in the Chicago Metropolitan Area. I specialize in JavaScript and its frameworks including React and Angular, I am also familiar with many libraries but more importantly know how to pick up and learn them quickly. I have a deep understanding of HTML and CSS as well, which I believe is imperative for most JavaScript work. 
            </p>
            <h2 className="what-i-do-header-2">
              Current Favorite Technologies
            </h2>
            <ul className="what-i-do-text">
              <li>
                JavaScript
              </li>
              <li>
                three.js
              </li>
              <li>
                React
              </li>
              <li>
                HTML/JSX
              </li>
              <li>
                CSS/SASS
              </li>
            </ul>
            <h2 className="what-i-do-header-2">
              My Experience
            </h2>
            <p className="what-i-do-text">
              I have nearly two years of professional experience at this point, having been stationed in the field since early 2017. I love the work I do and have worked with some rather prestegious companies on projects ranging from simple front-facing 'broshure' style websites to fully-functional web applications with multiple 'widgets' and tools contained within.
            </p>
            <h1 className="what-i-do-header">
              WHO I AM
            </h1>
            <p className="what-i-do-text">
              My name is Jason, I am an avid tech enthusiast and lover of all things complex. I have a rabid thirst for knowledge and I feel if I'm not learning I'm stagnating, so I seek to advance my knowledge and understanding of things I'm passionate about constantly.
            </p>
            <h2 className="what-i-do-header-2">
              Technology Is In My Blood
            </h2>
            <p className="what-i-do-text">
              My father and older brother are also software engineers/developers. Thanks to our Dad we were able to experience the wonders of technology at an early age, working with DOS as young as 3-4 years old and continuing to work with computers for the rest of our lives. There's nothing I enjoy more than spending my time working with complex systems and learning even more about the ins and outs of technology.
            </p>
          </div>
        </section>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    about: state.about,
    portfolio: state.portfolio,
    contact: state.contact,
    show: state.show,
    pause: state.pause,
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
    onShow: () => {
      dispatch({type: actionTypes.ONSHOW});
    },
    onPause: () => {
      dispatch({type: actionTypes.ONPAUSE});
    },
    onAbTrue: () => {
      dispatch({type: actionTypes.ABTRUE});
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutComponent);
