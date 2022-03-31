import types from './types';

const loginAction = (mb_id, mb_name, cu_code) => {
    
    return {
        type: types.SET_MBID,
        mb_id: mb_id,
        mb_name:mb_name,
        cu_code: cu_code
    };
}

export default loginAction