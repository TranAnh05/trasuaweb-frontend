import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '@/services/cartService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth(); // Lắng nghe sự thay đổi từ AuthContext
    const [cartCount, setCartCount] = useState(0); // Đếm số lượng
    const [cartTotal, setCartTotal] = useState(0); // Tổng tiền
    const [cartItems, setCartItems] = useState([]);
    const [isLoadingCart, setIsLoadingCart] = useState(false);

    const [processingItemId, setProcessingItemId] = useState(null);

    // 1. Hàm gọi API lấy dữ liệu giỏ hàng
    // Dùng useCallback để tránh việc hàm bị tạo lại liên tục gây re-render thừa
    const fetchCart = useCallback(async () => {
        setIsLoadingCart(true);
        try {
            const response = await cartService.getCart();
            // Giả sử API trả về mảng danh sách món trong response.data.cartItems
            if (response.status === 200 && response.data) {
                // 1. Set danh sách món
                setCartItems(response.data.cartItems || []);
                // 2. Lấy thẳng tổng số lượng Backend tính sẵn (Đỡ phải viết reduce)
                setCartCount(response.data.totalItems || 0);
                
                // 3. Lấy thẳng tổng tiền Backend tính sẵn (Khắc phục triệt để lỗi NaN)
                setCartTotal(response.data.cartTotalPrice || 0);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
            setCartItems([]);
            setCartCount(0);
            setCartTotal(0);
        } finally {
            setIsLoadingCart(false);
        }
    }, []);

    // 2. Tự động lấy giỏ hàng khi App vừa chạy HOẶC khi user đăng nhập/đăng xuất
    useEffect(() => {
        fetchCart();
    }, [user, fetchCart]); 
    
    // 3. Hàm làm sạch giỏ hàng (Dùng khi thanh toán xong)
    const clearCartLocal = () => {
        setCartItems([]);
        setCartCount(0);
        setCartTotal(0);
    };

    const updateCartItemQuantity = async (cartItemId, currentQuantity, type) => {
        let newQuantity = type === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
        
        if (newQuantity < 1) return; 
        if (newQuantity > 20) {
            toast.warning("Chỉ được mua tối đa 20 ly cho mỗi món!");
            return;
        }

        try {
            setProcessingItemId(cartItemId); // Khóa món hàng lại
            const response = await cartService.updateQuantity(cartItemId, newQuantity);
            
            if (response.status === 200 && response.data) {
                // Tối ưu UI: Cập nhật state nội bộ ngay lập tức thay vì gọi lại fetchCart() làm màn hình giật
                setCartItems(response.data.cartItems || []);
                setCartCount(response.data.totalItems || 0);
                setCartTotal(response.data.cartTotalPrice || 0);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Không thể cập nhật số lượng lúc này!");
            }
        } finally {
            setProcessingItemId(null); // Mở khóa
        }
    };

    // 2. Hàm xóa món
    const removeCartItem = async (cartItemId) => {
        try {
            setProcessingItemId(cartItemId);
            const response = await cartService.removeItem(cartItemId);
            
            if (response.status === 200 && response.data) {
                toast.success("Đã xóa món khỏi giỏ hàng!");
                setCartItems(response.data.cartItems || []);
                setCartCount(response.data.totalItems || 0);
                setCartTotal(response.data.cartTotalPrice || 0);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Không thể xóa sản phẩm lúc này!");
            }
        } finally {
            setProcessingItemId(null);
        }
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            cartCount, 
            cartTotal, 
            isLoadingCart, 
            fetchCart, 
            clearCartLocal,
            processingItemId,
            updateCartItemQuantity,
            removeCartItem

        }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom Hook để lấy data ra dùng cho nhanh
export const useCart = () => {
    return useContext(CartContext);
};