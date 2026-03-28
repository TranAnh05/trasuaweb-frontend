import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronRight, Filter, Plus } from 'lucide-react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { formatCurrency } from '@/utils/formatters';
import ProductCard from '@/components/product/ProductCard';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentCategory = searchParams.get('category') || '';
  const currentKeyword = searchParams.get('keyword') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentKeyword);

  useEffect(() => {
    categoryService.getActiveCategories().then(res => {
      if(res.status === 200) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const apiParams = {
          page: currentPage,
          limit: 12, // Tăng lên 12 cho chẵn 3 hoặc 4 cột
          sort: currentSort
        };

        if (currentCategory) apiParams.category = currentCategory;
        if (currentKeyword) apiParams.keyword = currentKeyword;

        const response = await productService.getProducts(apiParams);

        if (response.status === 200) {
          setProducts(response.data.content);
          setTotalPages(response.data.totalPages);
        }

        window.scrollTo({top: 0, left: 0, behavior: "smooth"})
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentKeyword, currentSort, currentPage]);

  const handleFilterChange = (key, value) => {
    // Clone url params hiện tại
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key); 
    }
    
    // [ĐIỂM SỬA CHỮA 1]: Nếu người dùng click vào Sidebar Danh mục -> Xóa Keyword cũ đi
    if (key === 'category') {
      newParams.delete('keyword');
      setSearchInput(''); // Xóa luôn text đang hiển thị trong ô input
    }

    // Nếu đổi bất kỳ bộ lọc nào, luôn reset về trang 1
    if (key !== 'page') newParams.set('page', 1);

    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    const newParams = new URLSearchParams(searchParams);
    
    if (searchInput.trim()) {
      newParams.set('keyword', searchInput.trim());
    } else {
      newParams.delete('keyword');
    }
    
    newParams.delete('category'); 
    newParams.set('page', 1);    
    
    setSearchParams(newParams);
  };

  const PriceDisplay = ({ minPrice, maxPrice }) => {
    if (minPrice === maxPrice || !maxPrice || maxPrice === 0) {
      return <p className="text-[#8cc63f] font-bold text-base">{formatCurrency(minPrice)}</p>;
    }
    return (
      <p className="text-[#8cc63f] font-bold text-base">
        {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
      </p>
    );
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-16 font-sans">
      
      {/* THANH TOP BAR HIỆN ĐẠI */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm font-medium">
            <Link to="/" className="hover:text-[#8cc63f] transition-colors">Trang chủ</Link> 
            <span className="mx-2">/</span> 
            <span className="text-gray-900 font-bold">Menu Sản Phẩm</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Tìm món ngon..." 
              className="w-full pl-5 pr-12 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-[#8cc63f] focus:ring-2 focus:ring-[#eaf5dd] rounded-full text-sm outline-none transition-all duration-300"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="absolute cursor-pointer right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-[#8cc63f] text-white rounded-full hover:bg-[#7ab036] transition-colors">
              <Search size={16} />
            </button>
          </form>

          <div>
            <select 
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl outline-none focus:border-[#8cc63f] cursor-pointer transition-colors"
              value={currentSort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="popular">Bán chạy nhất</option>
              <option value="price_asc">Giá: Thấp đến cao</option>
              <option value="price_desc">Giá: Cao đến thấp</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR BÊN TRÁI (Sticky) */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2 text-gray-800 font-bold uppercase text-sm tracking-wider">
              <Filter size={18} className="text-[#8cc63f]" /> Danh mục
            </div>
            
            <div className="p-3 flex flex-col gap-1">
              <button 
                onClick={() => handleFilterChange('category', '')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center cursor-pointer
                  ${currentCategory === '' 
                    ? 'bg-[#8cc63f] text-white shadow-md shadow-green-200' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#8cc63f]'}`}
              >
                Tất cả món
              </button>
              
              {categories.map(cat => (
                <div key={cat.id} className="mt-1">
                  <button 
                    onClick={() => handleFilterChange('category', cat.slug)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between group cursor-pointer
                      ${currentCategory === cat.slug 
                        ? 'bg-[#f4f9f0] text-[#8cc63f]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#8cc63f]'}`}
                  >
                    {cat.name}
                    {currentCategory === cat.slug && <span className="w-1.5 h-1.5 rounded-full bg-[#8cc63f]"></span>}
                  </button>
                  
                  {cat.children && cat.children.length > 0 && (
                    <div className="ml-4 mt-1 pl-4 border-l-2 border-gray-100 flex flex-col gap-1">
                      {cat.children.map(child => (
                        <button
                          key={child.id}
                          onClick={() => handleFilterChange('category', child.slug)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 cursor-pointer
                            ${currentCategory === child.slug 
                              ? 'text-[#8cc63f] font-bold bg-[#f4f9f0]' 
                              : 'text-gray-500 hover:text-[#8cc63f] hover:bg-gray-50'}`}
                        >
                          <ChevronRight size={14} className={currentCategory === child.slug ? 'text-[#8cc63f]' : 'text-gray-300'} />
                          {child.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LƯỚI SẢN PHẨM BÊN PHẢI */}
        <div className="w-full flex-grow">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#8cc63f] rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Đang pha trà, chờ xíu nhé...</p>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.length > 0 ? products.map(product => (
                  <ProductCard key={product.id} product={product} />
                )) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Search size={32} className="text-gray-300" />
                    </div>
                    <p className="text-lg font-bold text-gray-700">Không tìm thấy món này!</p>
                    <p className="text-gray-500">Thử tìm kiếm với một từ khóa khác xem sao nhé.</p>
                  </div>
                )}
              </div>

              {/* Phân trang (Pagination) */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handleFilterChange('page', pageNum)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all
                          ${currentPage === pageNum 
                            ? 'bg-[#8cc63f] text-white shadow-md shadow-green-200' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-[#8cc63f] hover:text-[#8cc63f]'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;