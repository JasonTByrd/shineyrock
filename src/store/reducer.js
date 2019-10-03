import * as actionTypes from './actions'

const initialState = {
    crossHair: false
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.TRUE_FALSE:
            console.log(action);
            return {
                ...state,
                crossHair: !state.crossHair
            };
        default:
            return state;
    }
};

export default reducer