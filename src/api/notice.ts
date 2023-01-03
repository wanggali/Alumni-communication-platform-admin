import request from '../utils/request';

export const getNoticeInfo = (data: any) => {
    return request({
        url: '/notice/getNoticeByPage',
        method: 'post',
        data: data
    });
};

export const addNoticeInfo = (data: any) => {
    return request({
        url: '/notice/addNotice',
        method: 'post',
        data: data
    });
};

export const updateNoticeInfo = (data: any) => {
    return request({
        url: '/notice/updateNotice',
        method: 'post',
        data: data
    });
};

export const deleteNoticeInfo = (data: any) => {
    return request({
        url: '/notice/deleteNotice',
        method: 'delete',
        data: data
    });
};


