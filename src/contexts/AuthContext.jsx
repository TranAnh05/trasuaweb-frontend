import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user từ LocalStorage khi khởi động app
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Hàm xử lý lưu trữ khi đăng nhập thành công
  const login = (userData, token) => {
    // 1. Lưu token để axiosClient dùng cho các request sau
    localStorage.setItem('access_token', token);
    
    // 2. Lưu thông tin user để hiển thị lên Navbar
    localStorage.setItem('user_info', JSON.stringify(userData));

    // 3. Xoa session_id khi da dang nhap
    localStorage.removeItem('guest_session_id');
    
    // 4. Cập nhật state để Navbar tự động re-render
    setUser(userData); 
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setUser(null);
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);