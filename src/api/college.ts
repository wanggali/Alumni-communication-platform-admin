import request from '../utils/request';

export const getCollegeInfo = (data: any) => {
    return request({
        url: '/college/ShowAllCollegeByPage',
        method: 'post',
        data: data
    });
};

export const addCollege = (data: any) => {
    return request({
        url: '/college/addCollege',
        method: 'post',
        data: data
    });
};

export const updateCollege = (data: any) => {
    return request({
        url: '/college/updateCollege',
        method: 'post',
        data: data
    });
};

export const deleteCollege = (data: any) => {
    return request({
        url: '/college/deleteCollege',
        method: 'delete',
        data: data
    });
};
