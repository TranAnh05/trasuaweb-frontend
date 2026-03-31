import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Package, User, LogOut } from 'lucide-react';

const ProfileLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Bảo vệ Route: Nếu chưa đăng nhập thì đá về trang Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Hàm kiểm tra link đang active
    const isActive = (path) => location.pathname.includes(path);

    return (
        <div className="bg-[#f8f9fa] min-h-screen py-10 font-sans">
            <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row gap-8">
                
                {/* CỘT TRÁI: SIDEBAR QUẢN LÝ (DÙNG CHUNG) */}
                <div className="w-full md:w-1/4 shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#eaf5dd] text-[#8cc63f] rounded-full flex items-center justify-center font-bold text-xl">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{user.fullName}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <User size={12} /> Thành viên
                                </p>
                            </div>
                        </div>
                        <div className="p-2 space-y-1">
                            {/* Menu Hồ sơ */}
                            <Link 
                                to="/account/profile" 
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium
                                    ${isActive('/account/profile') ? 'text-[#8cc63f] bg-[#f2f9e8]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#8cc63f]'}`}
                            >
                                <User size={18} /> Hồ sơ cá nhân
                            </Link>

                            {/* Menu Đơn hàng */}
                            <Link 
                                to="/account/orders" 
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium
                                    ${isActive('/account/orders') ? 'text-[#8cc63f] bg-[#f2f9e8]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#8cc63f]'}`}
                            >
                                <Package size={18} /> Đơn mua của tôi
                            </Link>

                            {/* Nút Đăng xuất */}
                            <button 
                                onClick={logout} 
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors text-left mt-2 border-t border-gray-50 font-medium"
                            >
                                <LogOut size={18} /> Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: NỘI DUNG ĐỘNG (THAY ĐỔI THEO URL) */}
                <div className="flex-1 w-full">
                    {/* React Router sẽ render component MyOrders hoặc UserProfile vào vị trí của Outlet này */}
                    <Outlet />
                </div>

            </div>
        </div>
    );
};

export default ProfileLayout;