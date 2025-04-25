import axios from 'axios';
import { setupAuthInterceptors } from './interceptors/auth.interceptor.ts';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

setupAuthInterceptors(axiosInstance);

export default axiosInstance;