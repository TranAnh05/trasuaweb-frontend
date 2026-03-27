import React, { useState } from 'react';
import { Clock, Phone, ShoppingCart, User, LogOut, LogIn, UserPlus, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Giả lập state đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Văn Anh');
  const [cartCount, setCartCount] = useState(0);

  return (
    <header className="w-full font-sans">
      {/* TẦNG 1: TOP BAR (Màu đen) */}
      <div className="bg-[#0a0a0a] text-gray-300 text-xs py-2 border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              <Clock size={14} className="mr-1.5" /> 8:00 - 22:30
            </span>
            <span className="flex items-center">
              <Phone size={14} className="mr-1.5" /> Hotline: 0898.222.633
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className="flex items-center text-[#8cc63f]">
                  <User size={14} className="mr-1" /> Xin chào, {userName}
                </span>
                <span className="text-gray-600">|</span>
                <button onClick={() => setIsLoggedIn(false)} className="flex items-center hover:text-white transition-colors cursor-pointer">
                  <LogOut size={14} className="mr-1" /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/register" className="flex items-center hover:text-white transition-colors">
                  <UserPlus size={14} className="mr-1" /> Đăng ký
                </Link>
                <span className="text-gray-600">|</span>
                <Link to="/login" className="flex items-center hover:text-white transition-colors">
                  <LogIn size={14} className="mr-1" /> Đăng nhập
                </Link>
              </div>
            )}

            <div className="pl-4 ml-4 border-l border-gray-600">
              <Link to="/cart" className="flex items-center hover:text-white transition-colors">
                <ShoppingCart size={14} className="mr-1.5" /> 
                Giỏ hàng / <span className="text-[#8cc63f] ml-1 font-bold">{cartCount}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* TẦNG 2: MAIN NAVIGATION (Màu đen bóng) */}
      <div className="bg-[#0f0f0f] shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white flex items-center">
            R&B<span className="text-[#8cc63f] ml-1">🍵</span>
          </Link>

          {/* Menu Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-white h-full">
            <Link to="/" className="hover:text-[#8cc63f] transition-colors flex items-center h-full">Trang chủ</Link>
            
            {/* MENU CÓ DROPDOWN */}
            <div className="relative group h-full flex items-center cursor-pointer">
              <span className="hover:text-[#8cc63f] transition-colors flex items-center">
                Menu <ChevronDown size={14} className="ml-1" />
              </span>
              {/* Box Dropdown (Ẩn đi, chỉ hiện khi hover vào thẻ cha) */}
              <div className="absolute top-full left-0 w-48 bg-white text-black shadow-lg rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  <Link to="/menu/tat-ca" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]">Tất cả sản phẩm</Link>
                  <Link to="/menu/tra-sua" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]">Trà sữa</Link>
                  <Link to="/menu/sua-tuoi" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]">Sữa tươi</Link>
                  <Link to="/menu/topping" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]">Topping</Link>
                </div>
              </div>
            </div>

            <Link to="/stores" className="hover:text-[#8cc63f] transition-colors flex items-center h-full">Cửa hàng</Link>
            
            {/* CHUYỆN TRÀ CÓ DROPDOWN */}
            <div className="relative group h-full flex items-center cursor-pointer">
              <span className="hover:text-[#8cc63f] transition-colors flex items-center">
                Chuyện trà <ChevronDown size={14} className="ml-1" />
              </span>
              <div className="absolute top-full left-0 w-48 bg-white text-black shadow-lg rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  <Link to="/story/nguon-goc" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]">Nguồn gốc lá trà</Link>
                  <Link to="/story/pha-che" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]">Nghệ thuật pha chế</Link>
                </div>
              </div>
            </div>

            <Link to="/hiring" className="hover:text-[#8cc63f] transition-colors flex items-center h-full">Tuyển dụng</Link>
            
            {/* VỀ CHÚNG TÔI CÓ DROPDOWN */}
            <div className="relative group h-full flex items-center cursor-pointer">
              <span className="hover:text-[#8cc63f] transition-colors flex items-center">
                Về chúng tôi <ChevronDown size={14} className="ml-1" />
              </span>
              <div className="absolute top-full left-0 w-48 bg-white text-black shadow-lg rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  <Link to="/about/cau-chuyen" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]">Câu chuyện thương hiệu</Link>
                  <Link to="/about/tam-nhin" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]">Tầm nhìn & Sứ mệnh</Link>
                  <Link to="/about/lien-he" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#8cc63f]">Liên hệ</Link>
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