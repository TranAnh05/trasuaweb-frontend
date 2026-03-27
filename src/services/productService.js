import axiosClient from './axiosClient';

export const productService = {
    // Hàm lấy danh sách sản phẩm, nhận vào một object params (ví dụ: { page: 1, limit: 4, sort: 'newest' })
    getProducts: (params) => {
        return axiosClient.get('/products', { params });
    },
    
    getProductBySlug: (slug) => {
        return axiosClient.get(`/products/${slug}`);
    }
};