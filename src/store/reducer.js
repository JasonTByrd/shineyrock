import * as actionTypes from './actions'

const initialState = {
    crossHair: false,
    mobile: false,
    fps: 0,
    about: false,
    paused: false,
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
        case actionTypes.ONPAUSE:
            return {
                ...state,
                paused: !state.paused
            };
        default:
            return state;
    }
};

export default reducer