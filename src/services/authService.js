import axiosClient from './axiosClient';

export const authService = {
    // Gọi API đăng ký, truyền data (gồm fullName, phone, email, password)
    register: (data) => {
        return axiosClient.post('/auth/register', data);
    },

    login: (data) => {
        return axiosClient.post('/auth/login', data);
    }
};