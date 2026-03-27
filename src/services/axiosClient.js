import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1', 
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Nếu API gọi quá 10s không phản hồi thì tự động ngắt (tránh treo web)
});

axiosClient.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    function (response) {
        return response.data; 
    },
    function (error) {
        if (error.response && error.response.status === 401) {
            console.error("Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default axiosClient;