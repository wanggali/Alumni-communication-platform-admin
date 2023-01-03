import request from '../utils/request';

export const getCommentAndReplyInfo = (data: any) => {
    return request({
        url: '/comment/getCommentByPageOrParam',
        method: 'post',
        data: data
    });
};


export const deleteComment = (data: any) => {
    return request({
        url: '/comment/deleteComment',
        method: 'delete',
        data: data
    });
};
