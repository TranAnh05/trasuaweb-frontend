import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";
import { formatCurrency } from "@/utils/formatters";
import {
    Package,
    User,
    LogOut,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    Coffee,
    ChevronRight,
    Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

// Cấu hình các Tabs và Trạng thái
const ORDER_TABS = [
    { id: "ALL", label: "Tất cả" },
    { id: "PENDING", label: "Chờ xác nhận" },
    { id: "PROCESSING", label: "Đang pha chế" },
    { id: "DELIVERING", label: "Đang giao" },
    { id: "COMPLETED", label: "Đã giao" },
    { id: "CANCELLED", label: "Đã hủy" },
];

const STATUS_CONFIG = {
    PENDING: {
        color: "text-orange-600",
        bg: "bg-orange-50",
        icon: Clock,
        text: "Chờ xác nhận",
    },
    PROCESSING: {
        color: "text-blue-600",
        bg: "bg-blue-50",
        icon: Coffee,
        text: "Đang pha chế",
    },
    DELIVERING: {
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        icon: Truck,
        text: "Đang giao hàng",
    },
    COMPLETED: {
        color: "text-green-600",
        bg: "bg-green-50",
        icon: CheckCircle2,
        text: "Hoàn thành",
    },
    CANCELLED: {
        color: "text-red-600",
        bg: "bg-red-50",
        icon: XCircle,
        text: "Đã hủy",
    },
};

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ALL");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await orderService.getMyOrders();
                if (response.status === 200) {
                    setOrders(response.data);
                }
            } catch (error) {
                toast.error("Không thể tải lịch sử đơn hàng!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []); // Không cần phụ thuộc vào user nữa vì ProfileLayout đã chặn bên ngoài rồi

    // Lọc đơn hàng theo Tab
    const filteredOrders =
        activeTab === "ALL"
            ? orders
            : orders.filter((order) => order.orderStatus === activeTab);

    // Xử lý Hủy đơn (Mô phỏng, em cần gọi API PUT /cancel sau này)
    const handleCancelOrder = (orderNo) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
            toast.info("Tính năng hủy đơn đang được phát triển!");
        }
    };

    return (
        <>
            {/* Header Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                <div className="flex overflow-x-auto custom-scrollbar">
                    {ORDER_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 min-w-[120px] py-4 text-sm font-medium text-center border-b-2 transition-colors duration-200 outline-none
                                        ${
                                            activeTab === tab.id
                                                ? "border-[#8cc63f] text-[#8cc63f] bg-green-50/30"
                                                : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                                        }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Khung tìm kiếm nhỏ (Tùy chọn) */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center">
                <Search className="text-gray-400 ml-3 mr-2" size={20} />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo Mã đơn hàng..."
                    className="flex-1 py-2 px-2 outline-none text-sm bg-transparent"
                    disabled
                />
            </div>

            {/* DANH SÁCH ĐƠN HÀNG */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Loader2
                        size={40}
                        className="animate-spin text-[#8cc63f] mb-4"
                    />
                    <p className="text-gray-500">
                        Đang lấy dữ liệu đơn hàng...
                    </p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center px-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Package size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                        Chưa có đơn hàng nào
                    </h3>
                    <p className="text-gray-500 mb-6 text-sm">
                        Bạn chưa có đơn hàng nào ở trạng thái này.
                    </p>
                    <Link
                        to="/menu"
                        className="px-6 py-2.5 bg-[#8cc63f] text-white rounded-lg font-medium hover:bg-[#7ab036] transition-colors"
                    >
                        Về Menu đặt hàng
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const statusInfo =
                            STATUS_CONFIG[order.orderStatus] ||
                            STATUS_CONFIG.PENDING;
                        const StatusIcon = statusInfo.icon;
                        // Lấy món đầu tiên để hiển thị đại diện
                        const firstItem =
                            order.items && order.items.length > 0
                                ? order.items[0]
                                : null;
                        const remainingItemsCount = order.items
                            ? order.items.length - 1
                            : 0;

                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Tiêu đề Card */}
                                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="font-bold text-gray-800">
                                            {order.orderNo}
                                        </span>
                                        <span className="text-gray-400 hidden sm:inline">
                                            |
                                        </span>
                                        <span className="text-gray-500 hidden sm:inline">
                                            {new Date(
                                                order.createdAt,
                                            ).toLocaleDateString("vi-VN")}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.bg} ${statusInfo.color}`}
                                    >
                                        <StatusIcon size={14} />{" "}
                                        {statusInfo.text}
                                    </div>
                                </div>

                                {/* Nội dung Card (Món ăn đại diện) */}
                                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-50">
                                    {firstItem && (
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-16 h-16 bg-[#eaf5dd] rounded-xl flex items-center justify-center shrink-0">
                                                <Coffee
                                                    className="text-[#8cc63f]"
                                                    size={24}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 line-clamp-1">
                                                    {firstItem.productName}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    Size: {firstItem.sizeName}{" "}
                                                    (x{firstItem.quantity})
                                                </p>
                                                {remainingItemsCount > 0 && (
                                                    <p className="text-xs font-medium text-gray-400 mt-1">
                                                        + {remainingItemsCount}{" "}
                                                        món khác trong đơn...
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Card */}
                                <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                                    <div className="text-right sm:text-left w-full sm:w-auto">
                                        <span className="text-sm text-gray-500 mr-2">
                                            Tổng tiền:
                                        </span>
                                        <span className="text-xl font-bold text-[#8cc63f]">
                                            {formatCurrency(order.totalAmount)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/success?orderNo=${order.orderNo}`,
                                                )
                                            }
                                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            Xem chi tiết
                                        </button>

                                        {order.orderStatus === "PENDING" && (
                                            <button
                                                onClick={() =>
                                                    handleCancelOrder(
                                                        order.orderNo,
                                                    )
                                                }
                                                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                Hủy đơn
                                            </button>
                                        )}

                                        {order.orderStatus === "COMPLETED" && (
                                            <button className="px-4 py-2 text-sm font-medium text-white bg-[#8cc63f] hover:bg-[#7ab036] rounded-lg transition-colors">
                                                Mua lại
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default MyOrders;
