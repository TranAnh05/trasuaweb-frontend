import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils/formatters';
import { 
    Search, Package, Coffee, Truck, Home, 
    XCircle, CheckCircle2, ArrowLeft, Loader2, MapPin, Phone, User
} from 'lucide-react';

const STEPS = [
    { key: 'PENDING', icon: Package, label: 'Đã đặt' },
    { key: 'PROCESSING', icon: Coffee, label: 'Pha chế' },
    { key: 'DELIVERING', icon: Truck, label: 'Đang giao' },
    { key: 'COMPLETED', icon: Home, label: 'Hoàn thành' }
];

const OrderTracking = () => {
    // State cho Form nhập liệu
    const [orderNo, setOrderNo] = useState('');
    const [phone, setPhone] = useState('');
    
    // State cho kết quả và trạng thái
    const [trackedOrder, setTrackedOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrackOrder = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!orderNo.trim() || !phone.trim()) {
            setError('Vui lòng nhập đầy đủ Mã đơn hàng và Số điện thoại.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await orderService.trackOrder(orderNo.trim(), phone.trim());
            if (response.status === 200) {
                setTrackedOrder(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin!');
            setTrackedOrder(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setTrackedOrder(null);
        setOrderNo('');
        setPhone('');
        setError('');
    };

    // Hàm xác định bước hiện tại trong Stepper
    const getCurrentStepIndex = (status) => {
        return STEPS.findIndex(step => step.key === status);
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen py-12 font-sans px-4 flex justify-center items-start">
            <div className="w-full max-w-2xl">
                
                {/* Header Tiêu đề */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Tra cứu đơn hàng</h1>
                    <p className="text-gray-500">Kiểm tra trạng thái đơn hàng của bạn mọi lúc, mọi nơi.</p>
                </div>

                {/* KHỐI 1: FORM NHẬP LIỆU (Hiển thị khi chưa có kết quả) */}
                {!trackedOrder && (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <form onSubmit={handleTrackOrder} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã đơn hàng</label>
                                <input 
                                    type="text" 
                                    value={orderNo}
                                    onChange={(e) => setOrderNo(e.target.value)}
                                    placeholder="VD: ORD-1711900000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f] outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại đặt hàng</label>
                                <input 
                                    type="tel" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="VD: 0912345678"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#8cc63f]/20 focus:border-[#8cc63f] outline-none transition-all"
                                />
                            </div>

                            {/* Cảnh báo lỗi */}
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                                    <XCircle size={18} /> {error}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-[#8cc63f] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#7ab036] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
                                TRA CỨU NGAY
                            </button>
                        </form>
                    </div>
                )}

                {/* KHỐI 2: KẾT QUẢ TRA CỨU (Hiển thị khi đã có data) */}
                {trackedOrder && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                        
                        {/* Status Stepper */}
                        {trackedOrder.orderStatus === 'CANCELLED' ? (
                            <div className="bg-red-50 p-6 text-center border-b border-red-100">
                                <XCircle size={48} className="text-red-500 mx-auto mb-2" />
                                <h3 className="text-xl font-bold text-red-600">Đơn hàng đã bị hủy</h3>
                                <p className="text-red-400 text-sm mt-1">Vui lòng liên hệ Hotline nếu bạn cần hỗ trợ thêm.</p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-6 md:px-10 border-b border-gray-100">
                                <div className="flex items-center justify-between relative">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0 -translate-y-1/2 rounded-full"></div>
                                    
                                    {STEPS.map((step, index) => {
                                        const currentIndex = getCurrentStepIndex(trackedOrder.orderStatus);
                                        const isCompleted = index <= currentIndex;
                                        const isCurrent = index === currentIndex;
                                        const StepIcon = step.icon;

                                        return (
                                            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300
                                                    ${isCompleted ? 'bg-[#8cc63f] text-white shadow-md' : 'bg-gray-200 text-gray-400'}
                                                    ${isCurrent ? 'ring-4 ring-green-100' : ''}
                                                `}>
                                                    <StepIcon size={20} />
                                                </div>
                                                <span className={`text-xs font-bold ${isCompleted ? 'text-[#8cc63f]' : 'text-gray-400 font-medium'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="p-6 md:p-8">
                            {/* Thông tin che mờ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1 flex items-center gap-1"><User size={14}/> Người nhận:</p>
                                    <p className="font-bold text-gray-800">{trackedOrder.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1 flex items-center gap-1"><MapPin size={14}/> Giao đến:</p>
                                    {/* Dữ liệu này đã được Backend che mờ (VD: 123 Đường A ***) */}
                                    <p className="font-bold text-gray-800">{trackedOrder.shippingAddress}</p> 
                                </div>
                            </div>

                            {/* Danh sách món tóm tắt */}
                            <h3 className="font-bold text-gray-800 mb-3">Sản phẩm ({trackedOrder.items?.length || 0})</h3>
                            <div className="space-y-3 mb-6">
                                {trackedOrder.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-700">{item.quantity}x</span>
                                            <span className="text-gray-600">{item.productName} ({item.sizeName})</span>
                                        </div>
                                        <span className="font-medium text-gray-800">{formatCurrency(item.subtotal)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center py-4 border-t border-gray-100">
                                <span className="font-bold text-gray-600">Tổng thanh toán</span>
                                <span className="text-xl font-bold text-[#8cc63f]">{formatCurrency(trackedOrder.totalAmount)}</span>
                            </div>

                            <button 
                                onClick={handleReset}
                                className="w-full mt-6 py-3 border-2 border-[#8cc63f] text-[#8cc63f] rounded-xl font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Search size={20} /> Tra cứu đơn khác
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default OrderTracking;