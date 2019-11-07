import React, { Component } from "react";
import './portfolio-page-component.css';
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';
import portfolioHeaderImage from '../assets/images/about-header.jpg';
import portfolioImageOne from '../assets/images/portfolio-image-1.jpg';
import threeJsPlayground from '../assets/images/three-js-playground.jpg';
import pickHelperImage from '../assets/images/pick-helper.jpg';
import  { Redirect } from 'react-router-dom'

class PortfolioComponent extends Component {

  details01
  details02
  details03
  close = false;

  componentDidMount() {
    this.props.onPortTrue();
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
        this.props.onPortfolio();
      }, 1000);
    }
  }

  stopProp = (event) => {
    event.stopPropagation();
  }

  detailsClick = (e, parent) => {
    console.log(parent)
    if(this.props.mobile) {
      if (e.target.getAttribute('touched') === 'true' && (e.target.getAttribute('href') !== false || e.target.getAttribute('fill') !== false)) {
      }
      else {
        e.preventDefault();
        let items = document.querySelectorAll('.item-link');
        items.forEach(item => {
          item.setAttribute('touched', 'false');
        })
        let icons = document.querySelectorAll('.code-icon');
        icons.forEach(icon => {
          icon.setAttribute('touched', 'false');
        })
        if(e.target.getAttribute('href') === false) {
          let links = e.target.querySelectorAll('a');
          links.forEach(link => {
            link.setAttribute('touched', 'true')
          });
        }
        else {
          let links = parent.querySelectorAll('a');

          links.forEach(link => {
            link.setAttribute('touched', 'true')
          })
        }
      }
    } else {
    }
  }

  render() {
    return (
      <div className={!this.props.show ? "portfolio-page-container" : "portfolio-page-container show"}>
        {this.close && <Redirect to='/' />}
        <div className="close-me p-close-me" onClick={e => this.closeMe(e)}>
          <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="window-close" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-window-close fa-w-16 fa-9x"><path fill="currentColor" d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h404c3.3 0 6 2.7 6 6v340zM356.5 194.6L295.1 256l61.4 61.4c4.6 4.6 4.6 12.1 0 16.8l-22.3 22.3c-4.6 4.6-12.1 4.6-16.8 0L256 295.1l-61.4 61.4c-4.6 4.6-12.1 4.6-16.8 0l-22.3-22.3c-4.6-4.6-4.6-12.1 0-16.8l61.4-61.4-61.4-61.4c-4.6-4.6-4.6-12.1 0-16.8l22.3-22.3c4.6-4.6 12.1-4.6 16.8 0l61.4 61.4 61.4-61.4c4.6-4.6 12.1-4.6 16.8 0l22.3 22.3c4.7 4.6 4.7 12.1 0 16.8z" className=""></path></svg>
        </div>
        <section className="portfolio-header">
          <img src={portfolioHeaderImage} className="portfolio-header-image" alt="keyboard-portfolio header">
          </img>
        </section>

        <section className="portfolio-content">
          <div className="what-i-do">
            <h1 className="what-i-do-header">
              MY WORK
            </h1>
            <h2 className="what-i-do-header-2">
              Personal Projects
            </h2>
            <p className="what-i-do-text">
              My personal projects with their respective github/codepen repositories. (Hover or touch for more information.)
            </p>
            <div className="portfolio-grid-body">
              <div className="portfolio-grid-item">
                <img key={new Date()} src={portfolioImageOne} className="portfolio-image" alt="shineyrock.org thumbnail">
                </img>
                <div className="portfolio-item-details" ref={ref => (this.details01 = ref)} onClick={e => this.detailsClick(e, this.details01)}>
                  <a href="https://shineyrock.org" className="item-link" target="_blank" rel="noopener noreferrer" onClick={e => this.detailsClick(e, this.details01)}>shineyrock.org</a>
                  <a href="https://github.com/JasonTByrd/shineyrock" className="code-icon" target="_blank" rel="noopener noreferrer" onClick={e => this.detailsClick(e, this.details01)}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="code" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="svg-inline--fa fa-code fa-w-20 fa-9x"><path fill="currentColor" d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z" className=""></path></svg>
                  </a>
                </div>
              </div>
              <div className="portfolio-grid-item">
                <img key={new Date()} src={threeJsPlayground} className="portfolio-image" alt="shineyrock.org thumbnail">
                </img>
                <div className="portfolio-item-details" ref={ref => (this.details02 = ref)} onClick={e => this.detailsClick(e, this.details02)}>
                  <a href="https://codepen.io/jasontbyrd/full/XWraGZK" className="item-link" target="_blank" rel="noopener noreferrer" onClick={e => this.detailsClick(e, this.details02)}>Three JS Playground</a>
                  <a href="https://codepen.io/jasontbyrd/pen/XWraGZK" className="code-icon" target="_blank" rel="noopener noreferrer" onClick={e => this.detailsClick(e, this.details02)}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="code" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="svg-inline--fa fa-code fa-w-20 fa-9x"><path fill="currentColor" d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z" className=""></path></svg>
                  </a>
                </div>
              </div>
              <div className="portfolio-grid-item">
                <img key={new Date()} src={pickHelperImage} className="portfolio-image" alt="shineyrock.org thumbnail">
                </img>
                <div className="portfolio-item-details" ref={ref => (this.details03 = ref)} onClick={e => this.detailsClick(e, this.details03)}>
                  <a href="https://github.com/JasonTByrd/pick-helper" className="item-link" target="_blank" rel="noopener noreferrer" onClick={e => this.detailsClick(e, this.details03)}>Pick Helper</a>
                  <a href="https://github.com/JasonTByrd/pick-helper" className="code-icon" target="_blank" rel="noopener noreferrer" onClick={e => this.detailsClick(e, this.details03)}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="code" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="svg-inline--fa fa-code fa-w-20 fa-9x"><path fill="currentColor" d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z" className=""></path></svg>
                  </a>
                </div>
              </div>
            </div>
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
    mobile: state.mobile,
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
    onPortTrue: () => {
      dispatch({type: actionTypes.PORTTRUE});
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioComponent);
