import types from './types';

export function setNavigator(navigator) {

    return {
        type: types.SET_NAVIGATOR,
        navigator: navigator
    };
}
