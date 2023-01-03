import request from '../utils/request';

export const getAnalysisTotal = () => {
    return request({
        url: '/analysis/analysisInTotal',
        method: 'get',
    });
};

export const getAnalysisWeek = () => {
    return request({
        url: '/analysis/analysisInWeek',
        method: 'get',
    });
};

export const getAnalysisComment = () => {
    return request({
        url: '/analysis/analysisInComment',
        method: 'get',
    });
};

export const getAnalysisUp = () => {
    return request({
        url: '/analysis/analysisInUp',
        method: 'get',
    });
};


