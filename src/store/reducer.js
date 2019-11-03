import * as actionTypes from './actions'

const initialState = {
    crossHair: false,
    mobile: false,
    fps: 0,
    about: false,
    contact: false,
    portfolio: false,
    paused: false,
    show: false,
    mailSent: false,
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.TRUE_FALSE:
            return {
                ...state,
                crossHair: !state.crossHair
            };
        case actionTypes.MOBILE:
            return {
                ...state,
                mobile: !state.mobile
            };
        case actionTypes.FPSUPDATE:
            return {
                ...state,
                fps: action.payload
            };
        case actionTypes.ONABOUT:
            return {
                ...state,
                about: !state.about
            };
        case actionTypes.ONPORTFOLIO:
            return {
                ...state,
                portfolio: !state.portfolio
            };
        case actionTypes.ONCONTACT:
            return {
                ...state,
                contact: !state.contact
            };
        case actionTypes.ONPAUSE:
            return {
                ...state,
                paused: !state.paused
            };
        case actionTypes.ONSHOW:
            return {
                ...state,
                show: !state.show
            };
        case actionTypes.ONSENT:
            return {
                ...state,
                mailSent: !state.mailSent
            };
        default:
            return state;
    }
};

export default reducer