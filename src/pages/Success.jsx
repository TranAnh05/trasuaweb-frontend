import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
    CheckCircle2, Package, Truck, Home, MapPin, 
    Phone, User, CreditCard, ChevronRight, Loader2, ArrowLeft 
} from 'lucide-react';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils/formatters';

const Success = () => {
    const [searchParams] = useSearchParams();
    const orderNo = searchParams.get('orderNo');
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Nếu khách cố tình vào trang này mà không có mã đơn -> Đuổi về trang chủ
        if (!orderNo) {
            navigate('/');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                // Lấy sessionId từ local (dùng cho Khách vãng lai)
                const sessionId = localStorage.getItem('guest_session_id');
                const response = await orderService.getOrderDetails(orderNo, sessionId);
                
                if (response.status === 200 && response.data) {
                    setOrder(response.data);
                }
            } catch (err) {
                console.error("Lỗi lấy đơn hàng:", err);
                // Bắt lỗi 403 (Không có quyền) hoặc 404 (Không tìm thấy)
                setError(err.response?.data?.message || "Không thể tải thông tin đơn hàng.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderNo, navigate]);

    // Trạng thái Loading
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa]">
                <Loader2 size={48} className="animate-spin text-[#8cc63f] mb-4" />
                <p className="text-gray-500 font-medium">Đang tải thông tin hóa đơn...</p>
            </div>
        );
    }

    // Trạng thái Lỗi (Sai mã, Không có quyền xem)
    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] px-4 text-center">
                <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Rất tiếc!</h2>
                <p className="text-gray-500 mb-8 max-w-md">{error}</p>
                <Link to="/" className="px-8 py-3 bg-[#8cc63f] text-white rounded-xl font-bold hover:bg-[#7ab036] transition-colors">
                    Về trang chủ
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#f8f9fa] min-h-screen py-12 font-sans px-4">
            <div className="max-w-3xl mx-auto">
                
                {/* Header: Lời cảm ơn */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-green-100 text-[#8cc63f] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-white">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Đặt hàng thành công!</h1>
                    <p className="text-gray-500">Cảm ơn bạn đã mua sắm. Đơn hàng <span className="font-bold text-[#8cc63f]">{order.orderNo}</span> đang được xử lý.</p>
                </div>

                {/* Main Card: Biên lai điện tử */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    
                    {/* Tiến trình đơn hàng (Stepper) */}
                    <div className="bg-gray-50 p-6 md:px-10 border-b border-gray-100">
                        <div className="flex items-center justify-between relative">
                            {/* Đường gạch nối */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 -translate-y-1/2 rounded-full"></div>
                            
                            {/* Nút 1: Đã đặt */}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-[#8cc63f] text-white flex items-center justify-center shadow-md">
                                    <Package size={20} />
                                </div>
                                <span className="text-xs font-bold text-[#8cc63f]">Đã đặt</span>
                            </div>

                            {/* Nút 2: Đang pha chế (Mờ) */}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
                                    <Package size={20} />
                                </div>
                                <span className="text-xs font-medium text-gray-400">Pha chế</span>
                            </div>

                            {/* Nút 3: Đang giao (Mờ) */}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
                                    <Truck size={20} />
                                </div>
                                <span className="text-xs font-medium text-gray-400">Đang giao</span>
                            </div>

                            {/* Nút 4: Hoàn thành (Mờ) */}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
                                    <Home size={20} />
                                </div>
                                <span className="text-xs font-medium text-gray-400">Hoàn thành</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-10">
                        {/* Chi tiết đơn hàng */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Danh sách món ({order.items?.length || 0})</h3>
                            <div className="space-y-4">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-gray-800">{item.quantity} x {item.productName}</p>
                                            <p className="text-sm text-gray-500">Size: {item.sizeName}</p>
                                            {item.toppings?.length > 0 && (
                                                <p className="text-sm text-gray-500">+ {item.toppings.map(t => `${t.quantity} ${t.toppingName}`).join(', ')}</p>
                                            )}
                                        </div>
                                        <p className="font-bold text-gray-800">{formatCurrency(item.subtotal)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tổng kết tiền */}
                        <div className="bg-gray-50 p-5 rounded-2xl mb-8 space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính</span>
                                <span>{formatCurrency(order.totalAmount - order.shippingFee)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Phí giao hàng</span>
                                <span>{formatCurrency(order.shippingFee)}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-[#8cc63f]">
                                    <span>Giảm giá</span>
                                    <span>-{formatCurrency(order.discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg text-gray-800 pt-3 border-t border-gray-200">
                                <span>Tổng thanh toán</span>
                                <span className="text-[#8cc63f]">{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>

                        {/* Thông tin nhận hàng */}
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Thông tin nhận hàng</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                            <div className="flex items-start gap-3">
                                <User className="text-gray-400 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="font-bold text-gray-800">Người nhận</p>
                                    <p>{order.customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="text-gray-400 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="font-bold text-gray-800">Số điện thoại</p>
                                    <p>{order.customerPhone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 md:col-span-2">
                                <MapPin className="text-gray-400 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="font-bold text-gray-800">Địa chỉ giao hàng</p>
                                    <p className="leading-relaxed">{order.shippingAddress}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 md:col-span-2">
                                <CreditCard className="text-gray-400 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="font-bold text-gray-800">Phương thức thanh toán</p>
                                    <p>{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod}</p>
                                    <p className="text-xs text-orange-500 font-medium mt-1">Trạng thái: {order.payStatus === 'UNPAID' ? 'Chưa thanh toán' : 'Đã thanh toán'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/menu" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm border border-gray-200">
                        <ArrowLeft size={20} /> Tiếp tục mua sắm
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Success;