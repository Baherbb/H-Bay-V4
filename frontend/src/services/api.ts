import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const refreshResponse = await axios.post('/api/auth/refresh-token');
            const newToken = refreshResponse.data.data.token;

            localStorage.setItem('token', newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
        }

        return Promise.reject(error);
    }
);

export default api;