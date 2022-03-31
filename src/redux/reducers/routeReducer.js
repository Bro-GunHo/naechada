import types from '../actions/types';

const defaultState = {
    route : null,
}
export default route = (state = defaultState, action) => {
    // For Debugger
    switch (action.type) {
        case types.SET_ROUTE:
            return {
                route : action.route,
            };
        default:
        return state;
    }
};
