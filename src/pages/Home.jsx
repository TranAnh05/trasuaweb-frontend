import React, { useState, useEffect } from 'react';
import BannerSlider from '../components/layouts/BannerSlider';
import { productService } from '../services/productService';
import { formatCurrency } from '../utils/formatters';

const Home = () => {
  // 1. Khởi tạo State chuẩn chỉnh
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Gọi API khi component được mount
  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        setLoading(true);
        // Gọi API lấy 4 sản phẩm mới nhất
        const response = await productService.getProducts({ 
          limit: 4, 
          sort: 'newest' 
        });
        
        if (response.status === 200) {
          setProducts(response.data.content);
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        setError("Không thể tải danh sách sản phẩm lúc này. Vui lòng thử lại sau.");
      } finally {
        setLoading(false); 
      }
    };

    fetchNewProducts();
  }, []); // Array rỗng đảm bảo chỉ gọi 1 lần khi load trang

  // Component hiển thị giá thông minh (Xử lý vụ giá Min - Max)
  const PriceDisplay = ({ minPrice, maxPrice }) => {
    if (minPrice === maxPrice || !maxPrice || maxPrice === 0) {
      return <p className="text-[#8cc63f] text-sm font-bold">{formatCurrency(minPrice)}</p>;
    }
    return (
      <p className="text-[#8cc63f] text-sm font-bold">
        {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
      </p>
    );
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <BannerSlider />

      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-2xl shadow-sm overflow-hidden p-6">
          
          <div className="pr-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              Sản phẩm mới của <br/> 
              <span className="text-[#8cc63f]">R&B Tea</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Những ly trà mới với hương vị độc đáo tạo nên hương vị rất riêng của R&B Tea mà nhất định bạn phải thử.
            </p>
            <button className="border-2 border-[#8cc63f] text-[#8cc63f] font-semibold px-8 py-3 hover:bg-[#8cc63f] hover:text-white transition-colors rounded">
              Xem toàn bộ Menu
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Hiển thị Loading Skeleton hoặc Spinner khi đang gọi API */}
            {loading && (
              <div className="col-span-2 text-center py-10 text-gray-500">
                Đang tải sản phẩm mới...
              </div>
            )}

            {/* Hiển thị thông báo lỗi nếu Backend sập */}
            {error && !loading && (
              <div className="col-span-2 text-center py-10 text-red-500">
                {error}
              </div>
            )}

            {/* Lặp qua mảng sản phẩm thật từ Backend */}
            {!loading && !error && products.length > 0 && products.map((product) => (
              <div key={product.id} className="bg-[#eaf5dd] rounded-xl p-4 text-center relative group cursor-pointer hover:shadow-md transition-shadow">
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    NEW
                  </span>
                )}
                <div className="overflow-hidden rounded-lg mb-4 h-40 flex items-center justify-center bg-white">
                  <img 
                    // Nếu admin chưa up ảnh, hiển thị ảnh mặc định
                    src={product.defaultImage || "https://images.unsplash.com/photo-1558857563-b37102e99e00?auto=format&fit=crop&w=300&q=80"} 
                    alt={product.name} 
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate px-2" title={product.name}>
                  {product.name}
                </h3>
                {/* Gọi Component hiển thị giá thông minh */}
                <PriceDisplay minPrice={product.minPrice} maxPrice={product.maxPrice} />
              </div>
            ))}

            {/* Xử lý trường hợp DB trống */}
            {!loading && !error && products.length === 0 && (
              <div className="col-span-2 text-center py-10 text-gray-500">
                Chưa có sản phẩm nào được cập nhật.
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;