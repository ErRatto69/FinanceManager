import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './apiClient';

export const setupInterceptors = (onUnauthorized: () => void) => {
    apiClient.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    apiClient.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (error.response?.status === 401) {
                onUnauthorized();
            }
            return Promise.reject(error);
        }
    );
};