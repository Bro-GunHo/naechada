import types from './types';
export function setToken(token, fcmId) {

    return {
        type: types.SET_TOKEN,
        token: token,
        fcmId : fcmId
    };
}
