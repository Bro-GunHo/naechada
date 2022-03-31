import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import navigatorReducer from './navigatorReducer';
import routeReducer from './routeReducer';
import tokenReducer from './tokenReducer';
import locationReducer from './locationReducer';

export default combineReducers({
    login : loginReducer,
    navigator : navigatorReducer,
    route : routeReducer,
    token : tokenReducer,
    location : locationReducer,
});
