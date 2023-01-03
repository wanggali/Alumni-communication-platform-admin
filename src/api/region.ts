import request from '../utils/request';

export const getRegionTreeInfo = () => {
    return request({
        url: '/region/getRegionTreeInfo',
        method: 'get'
    });
};

export const addRegion = (value:any) => {
    return request({
        url: '/region/addRegion',
        method: 'post',
        data: value
    });
};

export const updateRegion = (value:any) => {
    return request({
        url: '/region/updateRegion',
        method: 'post',
        data: value
    });
};

export const deleteRegion = (value:any) => {
    return request({
        url: `/region/deleteRegion/${value.id}?levelId=${value.levelId}`,
        method: 'delete',
    });
};
