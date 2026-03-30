import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/utils/formatters";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/common/ConfirmModal";

const Cart = () => {
    const navigate = useNavigate();
    const {
        cartItems,
        cartTotal,
        isLoadingCart,
        processingItemId,
        updateCartItemQuantity,
        removeCartItem,
    } = useCart();

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        itemId: null,
    });

    const handleConfirmDelete = async () => {
        if (deleteModal.itemId) {
            await removeCartItem(deleteModal.itemId); // Gọi hàm xóa từ Context
            setDeleteModal({ isOpen: false, itemId: null }); // Đóng modal
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.warning("Giỏ hàng của bạn đang trống!");
            return;
        }
        navigate("/checkout"); // Chuyển sang trang thanh toán
    };

    // RENDER: TRẠNG THÁI GIỎ HÀNG TRỐNG
    if (!isLoadingCart && cartItems.length === 0) {
        return (
            <div className="bg-[#f8f9fa] min-h-[80vh] flex flex-col items-center justify-center font-sans p-4">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center max-w-md w-full">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-[#8cc63f]">
                        <ShoppingBag size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Giỏ hàng trống
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Bạn chưa thêm món nước nào vào giỏ hàng. Hãy khám phá
                        menu của chúng tôi nhé!
                    </p>
                    <Link
                        to="/menu"
                        className="bg-[#8cc63f] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#7ab036] transition-colors w-full flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={20} /> Quay lại Menu
                    </Link>
                </div>
            </div>
        );
    }

    // RENDER: GIAO DIỆN GIỎ HÀNG CHÍNH
    return (
        <div className="bg-[#f8f9fa] min-h-screen pb-20 font-sans pt-8">
            <div className="container mx-auto max-w-6xl px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <ShoppingBag className="text-[#8cc63f]" size={32} />
                    Giỏ hàng của bạn
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* CỘT TRÁI: DANH SÁCH MÓN (Chiếm 2/3) */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-4">
                        {cartItems.map((item) => {
                            const isProcessing = processingItemId === item.id;
                            return (
                                <div
                                    key={item.id}
                                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-all hover:shadow-md"
                                >
                                    {/* Ảnh sản phẩm */}
                                    <div className="w-24 h-24 bg-[#eaf5dd] rounded-xl p-2 shrink-0">
                                        <img
                                            src={
                                                item.productImage ||
                                                "https://images.unsplash.com/photo-1558857563-b37102e99e00?auto=format&fit=crop&w=150&q=80"
                                            }
                                            alt={item.productName}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                        />
                                    </div>

                                    {/* Thông tin sản phẩm */}
                                    <div className="grow">
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                                            {item.productName}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-2 font-medium">
                                            Size:{" "}
                                            <span className="text-gray-700">
                                                {item.sizeName}
                                            </span>
                                        </p>

                                        {/* Hiển thị Topping nếu có */}
                                        {item.toppings &&
                                            item.toppings.length > 0 && (
                                                <div className="text-sm text-gray-500 flex flex-wrap gap-x-3 gap-y-1">
                                                    <span className="font-medium text-gray-600">
                                                        Topping:
                                                    </span>
                                                    {item.toppings.map((t) => (
                                                        <span key={t.id}>
                                                            + {t.name} (x
                                                            {t.quantity})
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                    </div>

                                    {/* Khu vực Giá, Số lượng & Xóa */}
                                    <div className="flex flex-col items-end gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                                        <p className="font-bold text-[#8cc63f] text-lg">
                                            {formatCurrency(
                                                item.itemTotalPrice,
                                            )}
                                        </p>

                                        <div className="flex items-center gap-4">
                                            {/* Bộ điều khiển số lượng */}
                                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1">
                                                <button
                                                    onClick={() =>
                                                        updateCartItemQuantity(
                                                            item.id,
                                                            item.quantity,
                                                            "decrease",
                                                        )
                                                    }
                                                    disabled={isProcessing}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:text-black hover:shadow-sm rounded transition-all"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-10 text-center font-bold text-gray-800 text-sm">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateCartItemQuantity(
                                                            item.id,
                                                            item.quantity,
                                                            "increase",
                                                        )
                                                    }
                                                    disabled={isProcessing}
                                                    className="w-8 h-8 flex items-center justify-center text-[#8cc63f] hover:bg-white hover:text-green-600 hover:shadow-sm rounded transition-all"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            {/* Nút Xóa */}
                                            <button
                                                onClick={() =>
                                                    setDeleteModal({
                                                        isOpen: true,
                                                        itemId: item.id,
                                                    })
                                                }
                                                disabled={isProcessing}
                                                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Xóa món"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG (Chiếm 1/3) */}
                    <div className="w-full lg:w-1/3">
                        {/* Box này sẽ sticky (chạy theo màn hình khi cuộn) */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
                                Tóm tắt đơn hàng
                            </h2>

                            <div className="space-y-4 mb-6 text-gray-600">
                                <div className="flex justify-between items-center">
                                    <span>Tạm tính</span>
                                    <span className="font-medium text-gray-800">
                                        {formatCurrency(cartTotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Phí giao hàng</span>
                                    <span className="text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded">
                                        Tính ở bước thanh toán
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-800 font-bold">
                                        Tổng cộng
                                    </span>
                                    <div className="text-right">
                                        <span className="block text-3xl font-bold text-[#8cc63f] leading-none mb-1">
                                            {formatCurrency(cartTotal)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            (Đã bao gồm VAT)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-[#8cc63f] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#7ab036] transition-colors shadow-lg shadow-green-200"
                            >
                                Tiến hành thanh toán
                            </button>

                            <div className="mt-4 text-center">
                                <Link
                                    to="/menu"
                                    className="text-sm text-gray-500 hover:text-[#8cc63f] font-medium transition-colors"
                                >
                                    Tiếp tục mua thêm món khác
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, itemId: null })}
                onConfirm={handleConfirmDelete}
                title="Xóa sản phẩm"
                message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
                confirmText="Xóa sản phẩm"
                cancelText="Giữ lại"
            />
        </div>
    );
};

export default Cart;
