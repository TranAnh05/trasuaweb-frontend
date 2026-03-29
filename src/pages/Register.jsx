import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Phone, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { authService } from '@/services/authService';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    
    try {
      const response = await authService.register(data);
      if (response.status === 201) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate('/login');
      }
    } catch (error) {
      // Bắt lỗi từ Backend (ví dụ: Email đã tồn tại)
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Đã có lỗi xảy ra, vui lòng thử lại.");
      } else {
        toast.error("Không thể kết nối đến máy chủ.");
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* left: Banner Ảnh */}
      <div className="hidden lg:flex w-1/2 relative bg-black">
        <img 
          src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1471&auto=format&fit=crop" 
          alt="R&B Tea" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <Link to="/" className="text-3xl font-bold text-white inline-flex items-center w-fit">
            R&B<span className="text-[#8cc63f] ml-1">🍵</span>
          </Link>
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">Gia nhập cộng đồng</h1>
            <p className="text-lg text-gray-300 max-w-md">
              Tạo tài khoản ngay hôm nay để nhận ngay voucher giảm 20% cho ly trà sữa đầu tiên của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* right: Form Đăng ký */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-y-auto">
        <Link to="/" className="absolute top-8 left-8 lg:hidden text-gray-500 hover:text-[#8cc63f] flex items-center transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Trang chủ
        </Link>

        <div className="w-full max-w-md py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tạo tài khoản</h2>
            <p className="text-gray-500">Điền thông tin bên dưới để bắt đầu</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#8cc63f]/50 outline-none transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`}
                  placeholder="Nguyễn Văn A"
                  {...register("fullName", { required: "Họ tên không được để trống" })}
                />
              </div>
              {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#8cc63f]/50 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`}
                  placeholder="0912345678"
                  {...register("phone", { 
                    required: "Số điện thoại không được để trống",
                    pattern: {
                      value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      message: "Số điện thoại không đúng định dạng VN"
                    },
                    minLength: { value: 10, message: "Số điện thoại phải có ít nhất 10 số" },
                    maxLength: { value: 11, message: "Số điện thoại tối đa 11 số" }
                  })}
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
            </div>

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
                    required: "Email không được để trống",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không đúng định dạng"
                    }
                  })}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#8cc63f]/50 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-[#8cc63f]'}`}
                  placeholder="Tạo mật khẩu (Ít nhất 6 ký tự)"
                  {...register("password", { 
                    required: "Mật khẩu không được để trống",
                    minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                  })}
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

            {/* Nút Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#8cc63f] hover:bg-[#7ab036] text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng ký tài khoản"
              )}
            </button>
          </form>

          {/* Dẫn sang trang đăng nhập */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-[#8cc63f] font-bold hover:underline transition-all">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;