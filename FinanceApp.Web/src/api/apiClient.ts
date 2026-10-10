import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://api.finance.home-ratti.duckdns.org',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});