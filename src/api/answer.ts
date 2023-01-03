import request from '../utils/request';

export const getAnswerInfo = (data: any) => {
    return request({
        url: '/answer/getAnswerByPageOrParam',
        method: 'post',
        data: data
    });
};


export const deleteAnswerInfo = (data: any) => {
    return request({
        url: '/answer/deleteAnswer',
        method: 'delete',
        data: data
    });
};
