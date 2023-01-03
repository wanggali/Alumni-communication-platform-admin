import request from '../utils/request';

export const getPermissionInfo = () => {
    return request({
        url: '/permission/getPermissionByTree',
        method: 'get',
    });
};

export const addPermissionInfo = (data: any) => {
    return request({
        url: '/permission/addPermission',
        method: 'post',
        data: data
    });
};

export const updatePermissionInfo = (data: any) => {
    return request({
        url: '/permission/updatePermission',
        method: 'post',
        data: data
    });
};

export const deletePermissionInfo = (data: any) => {
    return request({
        url: '/permission/deletePermission',
        method: 'delete',
        data: data
    });
};

export const addRoleToPermission = (data: any) => {
    return request({
        url: '/permission/addPermissionToRole',
        method: 'post',
        data: data
    });
};

export const showRoleToPermission = (data: any) => {
    return request({
        url: `/permission/getRolePermissionInRoleId/${data}`,
        method: 'get',
    });
};
