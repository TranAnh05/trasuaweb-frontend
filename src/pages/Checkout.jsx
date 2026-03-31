import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";
import { formatCurrency } from "@/utils/formatters";
import { toast } from "react-toastify";
import {
    MapPin,
    User,
    Phone,
    Mail,
    FileText,
    CreditCard,
    CheckCircle2,
    Loader2,
    ArrowLeft,
} from "lucide-react";

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cartItems, cartTotal, clearCartLocal, isLoadingCart } = useCart();
    const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

    // Tạm thời fix cứng phí ship là 15k, sau này có thể làm API tính phí ship sau
    const SHIPPING_FEE = 15000;
    const FINAL_TOTAL = cartTotal + SHIPPING_FEE;

    // 1. Cấu hình React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            customerName: user?.fullName || "",
            customerPhone: user?.phone || "",
            customerEmail: user?.email || "",
            shippingAddress: "",
            internalNote: "",
            paymentMethod: "COD", // Mặc định chọn Tiền mặt
        },
    });

    // 2. Chặn khách vào trang Checkout khi giỏ hàng trống
    useEffect(() => {
        if (isCheckoutSuccess) return;

        if (!isLoadingCart && cartItems.length === 0) {
            toast.info("Giỏ hàng của bạn đang trống!");
            navigate("/cart");
        }
    }, [cartItems, isLoadingCart, navigate, isCheckoutSuccess]);

    // 3. Xử lý Logic Submit Đặt hàng
    const onSubmit = async (data) => {
        try {
            // Lấy Session ID cho Khách vãng lai
            const sessionId = localStorage.getItem("guest_session_id");
            const payload = { ...data, sessionId };

            const response = await orderService.placeOrder(payload);

            if (response.status === 200) {
                setIsCheckoutSuccess(true);
                toast.success("Đặt hàng thành công!");
                clearCartLocal(); // Dọn sạch giỏ hàng trên UI

                // Chuyển hướng sang trang Thành công kèm Mã đơn hàng
                const orderNo = response.data?.orderNo;
                navigate(`/success?orderNo=${orderNo}`, { replace: true });
            }
        } catch (error) {
            // Hiển thị lỗi từ Backend (Lỗi hết hàng hoặc lỗi Validate)
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(
                    "Rất tiếc, có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!",
                );
            }
        }
    };

    if (isLoadingCart || cartItems.length === 0) return null;

    return (
        <div className="bg-[#f8f9fa] min-h-screen pb-20 pt-8 font-sans">
            <div className="container mx-auto max-w-6xl px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#8cc63f] font-medium transition-colors mb-4"
                    >
                        <ArrowLeft size={20} /> Quay lại giỏ hàng
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tiến hành Thanh toán
                    </h1>
                </div>

                {/* Main Layout: 2 Cột */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col lg:flex-row gap-8"
                >
                    {/* CỘT TRÁI: FORM THÔNG TIN (2/3) */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        {/* Section 1: Thông tin liên hệ */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                <User className="text-[#8cc63f]" size={24} />{" "}
                                Thông tin người nhận
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Họ Tên */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        Họ và tên{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            readOnly={!!user} // Nếu có user -> True (Khóa lại)
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all outline-none
                                                        ${errors.customerName ? "border-red-500 bg-red-50" : "border-gray-200"}
                                                        ${user ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f]"}
                                                    `}
                                            placeholder="Nhập họ tên của bạn"
                                            {...register("customerName", {
                                                required:
                                                    "Vui lòng nhập họ tên",
                                                minLength: {
                                                    value: 2,
                                                    message: "Họ tên quá ngắn",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.customerName && (
                                        <p className="text-red-500 text-xs font-medium">
                                            {errors.customerName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Số điện thoại */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        Số điện thoại{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="tel"
                                            readOnly={!!user}
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all outline-none
                                                        ${errors.customerPhone ? "border-red-500 bg-red-50" : "border-gray-200"}
                                                        ${user ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f]"}
                                                    `}
                                            placeholder="Ví dụ: 0912345678"
                                            {...register("customerPhone", {
                                                required:
                                                    "Vui lòng nhập số điện thoại",
                                                pattern: {
                                                    value: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
                                                    message:
                                                        "Số điện thoại không hợp lệ",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.customerPhone && (
                                        <p className="text-red-500 text-xs font-medium">
                                            {errors.customerPhone.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email (Tùy chọn) */}
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Email nhận hóa đơn (Tùy chọn)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            readOnly={!!user}
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all outline-none
                                                        ${errors.customerEmail ? "border-red-500 bg-red-50" : "border-gray-200"}
                                                        ${user ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f]"}
                                                    `}
                                            placeholder="email@example.com"
                                            {...register("customerEmail", {
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message:
                                                        "Email không đúng định dạng",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.customerEmail && (
                                        <p className="text-red-500 text-xs font-medium">
                                            {errors.customerEmail.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Địa chỉ giao hàng */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                <MapPin className="text-[#8cc63f]" size={24} />{" "}
                                Địa chỉ giao hàng
                            </h2>
                            <div className="space-y-1">
                                <textarea
                                    rows="3"
                                    className={`w-full p-4 rounded-xl border ${errors.shippingAddress ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} focus:bg-white focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f] transition-all outline-none resize-none`}
                                    placeholder="Nhập chi tiết số nhà, tên đường, phường/xã, quận/huyện..."
                                    {...register("shippingAddress", {
                                        required:
                                            "Vui lòng nhập địa chỉ giao hàng",
                                        minLength: {
                                            value: 10,
                                            message:
                                                "Vui lòng nhập địa chỉ chi tiết hơn",
                                        },
                                    })}
                                ></textarea>
                                {errors.shippingAddress && (
                                    <p className="text-red-500 text-xs font-medium">
                                        {errors.shippingAddress.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Section 3: Phương thức thanh toán & Ghi chú */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                                <CreditCard
                                    className="text-[#8cc63f]"
                                    size={24}
                                />{" "}
                                Thanh toán & Ghi chú
                            </h2>

                            <div className="space-y-4 mb-6">
                                {/* Option 1: Tiền mặt */}
                                <label className="flex items-center p-4 border border-[#8cc63f] bg-[#f2f9e8] rounded-xl cursor-pointer transition-all">
                                    <input
                                        type="radio"
                                        value="COD"
                                        {...register("paymentMethod")}
                                        className="w-5 h-5 text-[#8cc63f] focus:ring-[#8cc63f] border-gray-300"
                                    />
                                    <div className="ml-3">
                                        <span className="block text-gray-800 font-bold">
                                            Thanh toán khi nhận hàng (COD)
                                        </span>
                                        <span className="block text-sm text-gray-500">
                                            Thanh toán bằng tiền mặt khi Shipper
                                            giao hàng tới
                                        </span>
                                    </div>
                                </label>

                                {/* Option 2: VNPay (Giao diện chờ nâng cấp) */}
                                <label className="flex items-center p-4 border border-gray-200 bg-gray-50 rounded-xl cursor-not-allowed opacity-60">
                                    <input
                                        type="radio"
                                        disabled
                                        className="w-5 h-5 text-gray-400 border-gray-300"
                                    />
                                    <div className="ml-3">
                                        <span className="block text-gray-800 font-bold">
                                            Thanh toán qua VNPay / Momo
                                        </span>
                                        <span className="block text-sm text-gray-500">
                                            Tính năng đang được nâng cấp, vui
                                            lòng chọn Tiền mặt
                                        </span>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FileText size={16} /> Ghi chú cho quán (Tùy
                                    chọn)
                                </label>
                                <textarea
                                    rows="2"
                                    className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f] transition-all outline-none resize-none"
                                    placeholder="Ví dụ: Lấy nhiều đá, giao tới gọi cho mình xuống lấy..."
                                    {...register("internalNote")}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: BILL TÍNH TIỀN (1/3) */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
                                Đơn hàng của bạn
                            </h2>

                            {/* Danh sách món mini */}
                            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-16 bg-[#eaf5dd] rounded-lg p-1 shrink-0">
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-full h-full object-contain mix-blend-multiply"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 text-sm line-clamp-2">
                                                {item.productName}
                                            </h4>
                                            <p className="text-xs text-gray-500 mb-1">
                                                Size {item.sizeName} x{" "}
                                                <span className="font-bold text-gray-700">
                                                    {item.quantity}
                                                </span>
                                            </p>
                                            <p className="font-bold text-[#8cc63f] text-sm">
                                                {formatCurrency(
                                                    item.itemTotalPrice,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Khối tính tiền */}
                            <div className="space-y-3 mb-6 text-sm text-gray-600 border-t border-gray-100 pt-4">
                                <div className="flex justify-between items-center">
                                    <span>
                                        Tạm tính ({cartItems.length} món)
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {formatCurrency(cartTotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Phí giao hàng</span>
                                    <span className="font-medium text-gray-800">
                                        {formatCurrency(SHIPPING_FEE)}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-800 font-bold">
                                        Tổng thanh toán
                                    </span>
                                    <span className="block text-2xl font-bold text-[#8cc63f] leading-none">
                                        {formatCurrency(FINAL_TOTAL)}
                                    </span>
                                </div>
                            </div>

                            {/* Nút Submit (Liên kết với form bên trái qua type="submit") */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#8cc63f] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#7ab036] transition-all shadow-lg shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2
                                            size={24}
                                            className="animate-spin"
                                        />{" "}
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={24} /> ĐẶT HÀNG NGAY
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
