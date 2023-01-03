import request from '../utils/request';

export const getRoleInfo = (data: any) => {
    return request({
        url: '/role/getRoleByPage',
        method: 'post',
        data: data
    });
};

export const addRoleInfo = (data: any) => {
    return request({
        url: '/role/addRole',
        method: 'post',
        data: data
    });
};

export const updateRoleInfo = (data: any) => {
    return request({
        url: '/role/updateRole',
        method: 'post',
        data: data
    });
};

export const deleteRoleInfo = (data: any) => {
    return request({
        url: '/role/deleteRole',
        method: 'delete',
        data: data
    });
};

export const addUserRoleInfo = (data: any) => {
    return request({
        url: '/role/addRoleToUser',
        method: 'post',
        data: data
    });
};

export const getUserRoleInfo = (data: any) => {
    return request({
        url: `/role/getRoleByUser?token=${data}`,
        method: 'get',
    });
};

