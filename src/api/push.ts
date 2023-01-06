import request from '../utils/request';

export const getPushInfo = (data:any) => {
    return request({
        url: '/push/getPushInfoByPageOrParam',
        method: 'post',
        data:data
    });
};

export const updatePushInfo = (data:any) => {
    return request({
        url: '/push/updatePush',
        method: 'post',
        data:data
    });
};

export const deletePushInfo = (data:any) => {
    return request({
        url: '/push/deletePush',
        method: 'delete',
        data:data
    });
};



