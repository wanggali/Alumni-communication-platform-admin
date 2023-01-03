import request from '../utils/request';

export const getAllTag = () => {
    return request({
        url: '/tag/showAllTag',
        method: 'get',
    });
};

export const addTag = (data: any) => {
    return request({
        url: '/tag/addTag',
        method: 'post',
        data: data
    });
};

export const updateTag = (data: any) => {
    return request({
        url: '/tag/updateTag',
        method: 'post',
        data: data
    });
};

export const deleteTag = (data: any) => {
    return request({
        url: '/tag/deleteTag',
        method: 'delete',
        data: data
    });
};
