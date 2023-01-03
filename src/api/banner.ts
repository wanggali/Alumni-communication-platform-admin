import request from '../utils/request';

export const getBannerInfo = (data: any) => {
    return request({
        url: '/banner/getBannerByPage',
        method: 'post',
        data: data
    });
};

export const addBannerInfo = (data: any) => {
    return request({
        url: '/banner/addBanner',
        method: 'post',
        data: data
    });
};

export const updateBannerInfo = (data: any) => {
    return request({
        url: '/banner/updateBanner',
        method: 'post',
        data: data
    });
};

export const deleteBannerInfo = (data: any) => {
    return request({
        url: '/banner/deleteBanner',
        method: 'delete',
        data: data
    });
};

