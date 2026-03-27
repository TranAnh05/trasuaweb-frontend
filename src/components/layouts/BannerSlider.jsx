import React, { useState, useEffect } from 'react';

// Dữ liệu giả lập (Placeholder Images) chất lượng cao
const mockBanners = [
  "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?q=80&w=1920&auto=format&fit=crop", // Trà sữa truyền thống
  "https://images.unsplash.com/photo-1558857563-b37102e99e00?q=80&w=1920&auto=format&fit=crop", // Trà dâu tây/trái cây
  "https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=1920&auto=format&fit=crop"  // Matcha Latte
];

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState(mockBanners);

  // Auto play logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Tự động chuyển slide sau mỗi 5 giây

    // Cleanup function: Rất quan trọng để không bị rò rỉ bộ nhớ (memory leak) khi component unmount
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="relative w-full h-[350px] md:h-[500px] overflow-hidden bg-gray-900">
      
      {/* Khung chứa các hình ảnh - Dùng CSS Transform để tạo hiệu ứng trượt */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((imgUrl, index) => (
          <img
            key={index}
            src={imgUrl}
            alt={`Khuyến mãi ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0 opacity-90"
          />
        ))}
      </div>

      {/* Box Text Overlays (Giống như chữ FULL MOON FESTIVAL trong UI của em) */}
      <div className="absolute top-1/2 left-10 md:left-24 transform -translate-y-1/2 text-white drop-shadow-lg">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 text-[#8cc63f] tracking-wide">
          R&B TEA FESTIVAL
        </h2>
        <p className="text-lg md:text-2xl mb-6">Trải nghiệm hương vị trà sữa chuẩn vị</p>
        <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-[#8cc63f] hover:text-black transition-colors shadow-lg">
          ORDER NOW
        </button>
      </div>

      {/* Nút Dots Indicator ở dưới đáy */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentIndex === index 
                ? 'bg-[#8cc63f] w-8' // Nút active sẽ dài ra một chút (hiệu ứng hiện đại)
                : 'bg-white/50 hover:bg-white'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;