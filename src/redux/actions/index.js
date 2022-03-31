import * as loginAction from './loginAction';
import * as navigatorAction from './navigatorAction';
import * as routeAction from './routeAction';
import * as tokenAction from './tokenAction';
import * as locationAction from './locationAction';

const ActionCreators = Object.assign({},
    loginAction,
    navigatorAction,
    routeAction,
    tokenAction,
    locationAction
);


export default ActionCreators;
