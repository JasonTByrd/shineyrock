import * as actionTypes from './actions'

const initialState = {
    crossHair: false,
    mobile: false,
    fps: 0
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
        default:
            return state;
    }
};

export default reducer