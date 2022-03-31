import types from '../actions/types';

const defaultState = {
    location : null
}
export default location = (state = defaultState, action) => {
    // For Debugger
    switch (action.type) {
        case types.SET_LOCATION:
            return {
                location : action.location
            };
        default:
        return state;
    }
};
