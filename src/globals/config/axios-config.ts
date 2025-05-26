import axios from 'axios';
import { setupAuthInterceptors } from '../interceptors/auth.interceptor.ts';
import { TokenCookieUtils } from '../utils/cookieUtils';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = TokenCookieUtils.getAccessToken();
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