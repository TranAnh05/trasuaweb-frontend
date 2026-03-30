import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Xác nhận xóa", 
    message = "Bạn có chắc chắn muốn thực hiện hành động này?",
    confirmText = "Xóa",
    cancelText = "Hủy"
}) => {
    if (!isOpen) return null;

    return (
        // Lớp nền đen mờ (Backdrop)
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
            
            {/* Hộp thoại Modal */}
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
                
                {/* Nút tắt nhỏ góc trên */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Icon Cảnh báo */}
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={28} className="text-red-500" />
                </div>

                {/* Nội dung */}
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                        {message}
                    </p>
                </div>

                {/* Cụm nút hành động */}
                <div className="flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-md shadow-red-200 transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;