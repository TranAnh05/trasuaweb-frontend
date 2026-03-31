import axiosClient from './axiosClient';

export const orderService = {
    // Gọi API Chốt đơn (Hỗ trợ cả Guest và User tự động nhờ axiosClient)
    placeOrder: (data) => {
        return axiosClient.post('/orders', data);
    },

    getOrderDetails: (orderNo, sessionId) => {
        return axiosClient.get(`/orders/${orderNo}`, {
            params: { sessionId: sessionId }
        });
    },

    getMyOrders: () => {
        return axiosClient.get('/orders/my-orders');
    },

    trackOrder: (orderNo, phone) => {
        return axiosClient.get(`/orders/track`, {
            params: { 
                orderNo: orderNo,
                phone: phone
            }
        });
    }
};