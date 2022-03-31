import types from '../actions/types';

const defaultState = {
    navigator : null,
}
export default navigator = (state = defaultState, action) => {
    // For Debugger
    switch (action.type) {
        case types.SET_NAVIGATOR:
            return {
                navigator : action.navigator,
            };
        default:
        return state;
    }
};
