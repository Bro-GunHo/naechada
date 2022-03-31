import types from '../actions/types';

const defaultState = {
    token : null,
    fcmId : null
}

export default token = (state = defaultState, action) => {
    // For Debugger
    switch (action.type) {
        case types.SET_TOKEN:
            return {
                token : action.token,
                fcmId : action.fcmId
            };
        default:
        return state;
    }
};
