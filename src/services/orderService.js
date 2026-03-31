import axiosClient from './axiosClient';

export const orderService = {
    // Gọi API Chốt đơn (Hỗ trợ cả Guest và User tự động nhờ axiosClient)
    placeOrder: (data) => {
        return axiosClient.post('/orders', data);
    }
};