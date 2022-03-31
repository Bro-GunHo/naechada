import types from '../actions/types';

const defaultState = {
    mb_id :null,
    mb_name :null,
    cu_code :null,    
}
export default login = (state = defaultState, action) => {
    // For Debugger
    switch (action.type) {
        case types.SET_MBID:
            return {
                mb_id : action.mb_id,
                mb_name : action.mb_name,
                cu_code : action.cu_code,                
            };
        default:
        return state;
    }
};
