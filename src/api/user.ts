import request from '../utils/request';

export const getUserInfo = (data: any) => {
    return request({
        url: '/user/getUserByPage',
        method: 'post',
        data: data
    });
};

export const updateUserInfo = (data: any) => {
    return request({
        url: '/user/updateUser',
        method: 'post',
        data: data
    });
};

export const deleteUserInfo = (data: any) => {
    return request({
        url: '/user/deleteUser',
        method: 'delete',
        data: data
    });
};

export const userAdminLogin = (data: any) => {
    return request({
        url: '/user/adminLogin',
        method: 'post',
        data: data
    });
};

export const userLogin = (data: any) => {
    return request({
        url: '/user/login',
        method: 'post',
        data: data
    });
};

export const getCurrentInfo = (data: any) => {
    return request({
        url: `/user/current?token=${data}`,
        method: 'get',
    });
};

export const updateUserPassword = (data: any) => {
    return request({
        url: `/user/updateUserPassword`,
        method: 'post',
        data: data
    });
};

export const updateUser = (data: any) => {
    return request({
        url: `/user/updateUser`,
        method: 'post',
        data: data
    });
};
