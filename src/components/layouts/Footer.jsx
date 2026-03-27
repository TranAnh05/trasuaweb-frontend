import React from 'react';
import { Link } from 'react-router-dom';
// Import Brand Icons từ react-icons/fa (FontAwesome)
import { FaFacebookF, FaYoutube, FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-12 border-t-4 border-[#8cc63f]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Cột 1: Giới thiệu */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 uppercase">Giới thiệu</h3>
            <p className="text-sm leading-relaxed text-justify">
              R&B luôn xem trọng chất lượng và sức khỏe của người tiêu dùng. Đến với R&B chúng tôi tự hào với đội ngũ hơn 30 năm kinh nghiệm kỹ thuật về trà sẽ mang đến cho thực khách các loại trà ngon nhất sánh tầm với Thế giới...
            </p>
          </div>

          {/* Cột 2: Liên hệ */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 uppercase">Liên hệ</h3>
            <ul className="text-sm space-y-2">
              <li><strong>R&B Tea Việt Nam</strong></li>
              <li>Số ĐKKD: 41E8052150, cấp 15/06/2024</li>
              <li>MST: 0302166322-002</li>
              <li>Hotline: <span className="text-[#8cc63f] font-bold">0898.222.633</span></li>
              <li>Địa chỉ: 190 Trần Hưng Đạo, P.11, Q.5, TP.HCM</li>
            </ul>
          </div>

          {/* Cột 3: Chứng nhận & Kết nối */}
          <div>
            <div className="mb-6">
              <div className="bg-white p-2 inline-block rounded">
                <img src="https://i.imgur.com/B10uH78.png" alt="Đã thông báo Bộ Công Thương" className="h-10" />
              </div>
            </div>
            <h3 className="text-white text-lg font-bold mb-4 uppercase">Kết nối với chúng tôi</h3>
            <div className="flex space-x-4">
              {/* Sử dụng react-icons */}
              <a href="#" className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#8cc63f] hover:text-white transition-colors">
                <FaTiktok size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white text-[#1877F2] flex items-center justify-center hover:bg-[#8cc63f] hover:text-white transition-colors">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white text-[#FF0000] flex items-center justify-center hover:bg-[#8cc63f] hover:text-white transition-colors">
                <FaYoutube size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white text-[#E4405F] flex items-center justify-center hover:bg-[#8cc63f] hover:text-white transition-colors">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          <div className="flex justify-center space-x-4 mb-2">
            <Link to="/about" className="hover:text-white">Giới thiệu</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-white">Điều khoản sử dụng</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-white">Chính sách bảo mật</Link>
          </div>
          <p>Copyright 2026 © R&B Tea.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;