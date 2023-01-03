import request from '../utils/request';

export const getAllOriginUserInfo = (data: any) => {
    return request({
        url: '/originUser/getOriginUsers',
        method: 'post',
        data: data
    });
};

export const addOriginUserInfo = (data: any) => {
    return request({
        url: '/originUser/addOriginUser',
        method: 'post',
        data: data
    });
};

export const deleteOriginUserInfo = (data: any) => {
    return request({
        url: '/originUser/deleteOriginUser',
        method: 'delete',
        data: data
    });
};


