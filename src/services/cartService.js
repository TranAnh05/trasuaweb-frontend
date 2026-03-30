import axiosClient from './axiosClient';

export const cartService = {
    // Gọi API thêm vào giỏ hàng
    addToCart: (data) => {
        return axiosClient.post('/carts/add', data);
    },
    
    // 2. Lấy thông tin giỏ hàng hiện tại
    getCart: () => {
        // Lấy sessionId từ localStorage (nếu có)
        const sessionId = localStorage.getItem('guest_session_id');
        
        // Truyền sessionId qua query params (VD: /carts?sessionId=abc-123)
        // Nếu khách đã đăng nhập, axiosClient sẽ tự động đính kèm Token vào Header
        return axiosClient.get('/carts', {
            params: { sessionId: sessionId }
        });
    },

    // Cập nhật số lượng
    updateQuantity: (cartItemId, quantity) => {
        const sessionId = localStorage.getItem('guest_session_id');
        return axiosClient.put(`/carts/items/${cartItemId}`, 
            { quantity: quantity }, // Body
            { params: { sessionId: sessionId } } // Query params
        );
    },

    //  Xóa món khỏi giỏ
    removeItem: (cartItemId) => {
        const sessionId = localStorage.getItem('guest_session_id');
        return axiosClient.delete(`/carts/items/${cartItemId}`, {
            params: { sessionId: sessionId }
        });
    }
};