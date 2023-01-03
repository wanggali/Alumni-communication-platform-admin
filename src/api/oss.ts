import request from '../utils/request';

export const uploadOssImg = (file:any) => {
    return request({
        url: '/oss/upload',
        method: 'post',
        data: file
    });
};
