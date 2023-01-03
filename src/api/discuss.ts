import request from '../utils/request';

export const addDiscussInfo = (data: any) => {
    return request({
        url: '/discuss/addDiscuss',
        method: 'post',
        data: data
    });
};

export const getDiscussInfo = (data: any) => {
    return request({
        url: '/discuss/getDiscussByPageOrParam',
        method: 'post',
        data: data
    });
};

export const deleteDiscussInfo = (data: any) => {
    return request({
        url: '/discuss/deleteDiscuss',
        method: 'delete',
        data: data
    });
};

export const updateDiscussInfo = (data: any) => {
    return request({
        url: '/discuss/updateDiscuss',
        method: 'post',
        data: data
    });
};
