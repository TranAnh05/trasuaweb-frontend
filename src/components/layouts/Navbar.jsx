import React, { useEffect, useState } from "react";
import {
    Clock,
    Phone,
    ShoppingCart,
    User,
    LogOut,
    LogIn,
    UserPlus,
    ChevronDown,
    Package,
    Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { categoryService } from "@/services/categoryService";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    const { cartCount } = useCart();

    // State lưu danh sách danh mục
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getActiveCategories();
                if (res.status === 200) {
                    setCategories(res.data);
                }
            } catch (error) {
                console.error("Lỗi tải danh mục menu:", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <header className="w-full font-sans">
            {/* TẦNG 1: TOP BAR (Màu đen) */}
            <div className="relative bg-[#0a0a0a] text-gray-300 text-xs py-2 border-b border-gray-800 z-[100]">
                <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
                    <div className="flex items-center space-x-6">
                        <span className="flex items-center">
                            <Clock size={14} className="mr-1.5" /> 8:00 - 22:30
                        </span>
                        <span className="flex items-center">
                            <Phone size={14} className="mr-1.5" /> Hotline:
                            0898.222.633
                        </span>

                        {!user && (
                            <>
                                <span className="text-gray-600">|</span>
                                <Link
                                    to="/track-order"
                                    className="flex items-center text-[#8cc63f] hover:text-white transition-colors font-medium"
                                >
                                    <Search size={14} className="mr-1.5" /> Tra
                                    cứu đơn hàng
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            // Sử dụng 'group' của Tailwind để làm dropdown CSS-only siêu mượt
                            <div className="relative group py-2">
                                <button className="flex items-center space-x-1 text-[#8cc63f] font-medium hover:text-[#7ab036] transition-colors cursor-pointer outline-none">
                                    <User size={14} className="mr-1" />
                                    <span>{user.fullName}</span>
                                    <ChevronDown
                                        size={14}
                                        className="ml-1 transition-transform group-hover:rotate-180"
                                    />
                                </button>

                                {/* Khối Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden translate-y-2 group-hover:translate-y-0">
                                    {/* Header nhỏ trong menu */}
                                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                        <p className="text-sm font-bold text-gray-800 truncate">
                                            {user.fullName}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>

                                    <Link
                                        to="/account/profile"
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#8cc63f] transition-colors"
                                    >
                                        <User
                                            size={16}
                                            className="mr-3 text-gray-400"
                                        />{" "}
                                        Tài khoản của tôi
                                    </Link>
                                    <Link
                                        to="/account/orders"
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#8cc63f] transition-colors border-t border-gray-50"
                                    >
                                        <Package
                                            size={16}
                                            className="mr-3 text-gray-400"
                                        />{" "}
                                        Đơn hàng của tôi
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 text-left"
                                    >
                                        <LogOut
                                            size={16}
                                            className="mr-3 text-red-400"
                                        />{" "}
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/register"
                                    className="flex items-center hover:text-white transition-colors"
                                >
                                    <UserPlus size={14} className="mr-1" /> Đăng
                                    ký
                                </Link>
                                <span className="text-gray-600">|</span>
                                <Link
                                    to="/login"
                                    className="flex items-center hover:text-white transition-colors"
                                >
                                    <LogIn size={14} className="mr-1" /> Đăng
                                    nhập
                                </Link>
                            </div>
                        )}

                        <div className="pl-4 ml-4 border-l border-gray-600">
                            <Link
                                to="/cart"
                                className="flex items-center hover:text-white transition-colors"
                            >
                                <ShoppingCart size={14} className="mr-1.5" />
                                Giỏ hàng /{" "}
                                <span className="text-[#8cc63f] ml-1 font-bold">
                                    {cartCount}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* TẦNG 2: MAIN NAVIGATION (Màu đen bóng) */}
            <div className="bg-[#0f0f0f] shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold text-white flex items-center"
                    >
                        R&B<span className="text-[#8cc63f] ml-1">🍵</span>
                    </Link>

                    {/* Menu Links */}
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-white h-full">
                        <Link
                            to="/"
                            className="hover:text-[#8cc63f] transition-colors flex items-center h-full"
                        >
                            Trang chủ
                        </Link>

                        {/* MENU CÓ DROPDOWN */}
                        <div className="relative group h-full flex items-center cursor-pointer">
                            <span className="hover:text-[#8cc63f] transition-colors flex items-center">
                                Menu <ChevronDown size={14} className="ml-1" />
                            </span>
                            <div className="absolute top-full left-0 w-48 bg-white text-black shadow-lg rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                                <div className="py-2">
                                    <Link
                                        to="/menu"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]"
                                    >
                                        Tất cả sản phẩm
                                    </Link>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            to={`/menu?category=${cat.slug}`}
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/stores"
                            className="hover:text-[#8cc63f] transition-colors flex items-center h-full"
                        >
                            Cửa hàng
                        </Link>

                        {/* CHUYỆN TRÀ CÓ DROPDOWN */}
                        <div className="relative group h-full flex items-center cursor-pointer">
                            <span className="hover:text-[#8cc63f] transition-colors flex items-center">
                                Chuyện trà{" "}
                                <ChevronDown size={14} className="ml-1" />
                            </span>
                            <div className="absolute top-full left-0 w-48 bg-white text-black shadow-lg rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                                <div className="py-2">
                                    <Link
                                        to="/story/nguon-goc"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]"
                                    >
                                        Nguồn gốc lá trà
                                    </Link>
                                    <Link
                                        to="/story/pha-che"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]"
                                    >
                                        Nghệ thuật pha chế
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/hiring"
                            className="hover:text-[#8cc63f] transition-colors flex items-center h-full"
                        >
                            Tuyển dụng
                        </Link>

                        {/* VỀ CHÚNG TÔI CÓ DROPDOWN */}
                        <div className="relative group h-full flex items-center cursor-pointer">
                            <span className="hover:text-[#8cc63f] transition-colors flex items-center">
                                Về chúng tôi{" "}
                                <ChevronDown size={14} className="ml-1" />
                            </span>
                            <div className="absolute top-full left-0 w-48 bg-white text-black shadow-lg rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                                <div className="py-2">
                                    <Link
                                        to="/about/cau-chuyen"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]"
                                    >
                                        Câu chuyện thương hiệu
                                    </Link>
                                    <Link
                                        to="/about/tam-nhin"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]"
                                    >
                                        Tầm nhìn & Sứ mệnh
                                    </Link>
                                    <Link
                                        to="/about/lien-he"
                                        className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]"
                                    >
                                        Liên hệ
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
