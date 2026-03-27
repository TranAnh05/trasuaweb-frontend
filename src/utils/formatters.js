// src/utils/formatters.js

export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0 đ';
    // Sử dụng API chuẩn của trình duyệt để format tiền tệ Việt Nam
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};