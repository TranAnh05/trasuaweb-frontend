export const getGuestSessionId = () => {
  // 1. Thử lấy session_id cũ trong trình duyệt
  let sessionId = localStorage.getItem('guest_session_id');
  
  // 2. Nếu chưa có (khách mới hoàn toàn), thì tự động sinh ra 1 mã mới
  if (!sessionId) {
    // Sử dụng crypto.randomUUID() có sẵn của trình duyệt để sinh mã chuẩn (VD: '123e4567-e89b-12d3-a456-426614174000')
    sessionId = crypto.randomUUID(); 
    
    // Lưu lại vào trình duyệt để dùng cho các lần sau
    localStorage.setItem('guest_session_id', sessionId);
  }
  
  return sessionId;
};