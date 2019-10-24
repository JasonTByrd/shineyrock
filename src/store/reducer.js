import * as actionTypes from './actions'

const initialState = {
    crossHair: false,
    mobile: false,
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.TRUE_FALSE:
            console.log(action);
            return {
                ...state,
                crossHair: !state.crossHair
            };
        case actionTypes.MOBILE:
            console.log(action);
            return {
                ...state,
                mobile: !state.mobile
            };
        default:
            return state;
    }
};

export default reducer