import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';

const service: AxiosInstance = axios.create({
    timeout: 5000,
    headers: {token: localStorage.getItem('acp_token')},
    baseURL: 'http://localhost:9001/api'
});

service.defaults.withCredentials = true; // 配置为true

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        const res = response.data
        if (res.code === 0) {
            return response.data;
        } else {
            return response.data
        }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
