import request from '../utils/request';

export const addDynamicInfo = (data: any) => {
    return request({
        url: '/dynamic/addDynamic',
        method: 'post',
        data: data
    });
};


export const getDynamicInfo = (data: any) => {
    return request({
        url: '/dynamic/getDynamicByPageOrParam',
        method: 'post',
        data: data
    });
};

export const deleteDynamicInfo = (data: any) => {
    return request({
        url: '/dynamic/deleteDynamic',
        method: 'delete',
        data: data
    });
};
