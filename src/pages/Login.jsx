import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext'; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const currentSessionId = localStorage.getItem('guest_session_id');
      if (currentSessionId) {
        data.sessionId = currentSessionId; 
      }

      const response = await authService.login(data);
      
      if (response.status === 200) {
        toast.success(response.message || "Đăng nhập thành công!");
        
        // Bóc tách dữ liệu từ cấu trúc: response.data (TokenResponse)
        const token = response.data.token;
        const user = response.data.user;
        
        // Gửi data vào Context để lưu và đổi giao diện Navbar
        login(user, token);
        navigate('/'); 
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } 
      else if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        toast.error("Email hoặc mật khẩu không chính xác!");
      } 
      else {
        toast.error("Không thể kết nối đến máy chủ.");
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Cột trái: Ảnh */}
      <div className="hidden lg:flex w-1/2 relative bg-black">
        <img 
          src="https://images.unsplash.com/photo-1576092762791-dd9e2220afa1?q=80&w=1470&auto=format&fit=crop" 
          alt="R&B Tea" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <Link to="/" className="text-3xl font-bold text-white flex items-center">
            R&B<span className="text-[#8cc63f] ml-1">🍵</span>
          </Link>
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">Hương vị nguyên bản</h1>
            <p className="text-lg text-gray-300 max-w-md">
              Đăng nhập để trải nghiệm mua sắm mượt mà, tích điểm và nhận ưu đãi độc quyền.
            </p>
          </div>
        </div>
      </div>

      {/* Cột phải: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <Link to="/" className="absolute top-8 left-8 lg:hidden text-gray-500 hover:text-[#8cc63f] flex items-center transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Trang chủ
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
            <p className="text-gray-500">Chào mừng bạn trở lại với R&B Tea</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#8cc63f]/50 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`}
                  placeholder="email@example.com"
                  {...register("email", { 
                    required: "Vui lòng nhập email",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Email sai định dạng" }
                  })}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Mật khẩu */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#8cc63f]/50 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`}
                  placeholder="Nhập mật khẩu"
                  {...register("password", { required: "Vui lòng nhập mật khẩu" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#8cc63f] hover:bg-[#7ab036] text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center mt-2 disabled:opacity-70"
            >
              {isSubmitting ? <><Loader2 size={20} className="animate-spin mr-2" /> Đang xử lý...</> : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" className="text-[#8cc63f] font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;