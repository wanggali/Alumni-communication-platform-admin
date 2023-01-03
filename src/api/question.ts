import request from '../utils/request';
import {getDiscussInfo} from "./discuss";

export const addQuestionInfo = (data: any) => {
    return request({
        url: '/question/addQuestion',
        method: 'post',
        data: data
    });
};

export const getQuestionInfo = (data: any) => {
    return request({
        url: '/question/getQuestionByPage',
        method: 'post',
        data: data
    });
};

export const updateQuestionInfo = (data: any) => {
    return request({
        url: '/question/updateQuestion',
        method: 'post',
        data: data
    });
};

export const deleteQuestionInfo = (data: any) => {
    return request({
        url: '/question/deleteQuestion',
        method: 'delete',
        data: data
    });
};
