import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

const PriceDisplay = ({ minPrice, maxPrice, isCompact }) => {
    const textSize = isCompact ? "text-sm" : "text-base";

    if (minPrice === maxPrice || !maxPrice || maxPrice === 0) {
        return (
            <p className={`text-[#8cc63f] font-bold ${textSize}`}>
                {formatCurrency(minPrice)}
            </p>
        );
    }

    return (
        <p className={`text-[#8cc63f] font-bold ${textSize}`}>
            {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
        </p>
    );
};

const ProductCard = ({ product, isCompact = false }) => {
    useEffect(() => {
        scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, []);
    return (
        <Link
            to={`/product/${product.slug}`}
            // Nó sẽ ép thẻ card rộng tối đa 240px và tự động căn giữa trong ô lưới của Trang Chủ
            className={`group bg-white shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#8cc63f]/30 transition-all duration-300 cursor-pointer flex flex-col h-full relative
        ${isCompact ? "rounded-xl p-3 max-w-60 mx-auto w-full" : "rounded-2xl p-4 w-full"}`}
        >
            {/* Badge NEW */}
            {product.isNew && (
                <span
                    className={`absolute bg-green-500 text-white font-bold rounded z-10 shadow-sm
          ${isCompact ? "top-2 left-2 text-[10px] px-1.5 py-0.5" : "top-4 left-4 text-xs px-2 py-1"}`}
                >
                    NEW
                </span>
            )}

            {/* Ảnh sản phẩm */}
            <div
                className={`relative w-full pt-[100%] bg-[#eaf5dd] overflow-hidden 
        ${isCompact ? "rounded-lg mb-3" : "rounded-xl mb-4"}`}
            >
                <img
                    src={
                        product.defaultImage ||
                        "https://images.unsplash.com/photo-1558857563-b37102e99e00?auto=format&fit=crop&w=300&q=80"
                    }
                    alt={product.name}
                    className={`absolute inset-0 w-full h-full object-contain group-hover:scale-110 transition-transform duration-500
            ${isCompact ? "p-2" : "p-4"}`}
                />
            </div>

            {/* Thông tin - Tiêu đề */}
            <h3
                className={`font-bold text-gray-800 line-clamp-2 group-hover:text-[#8cc63f] transition-colors
        ${isCompact ? "text-xs mb-1.5" : "text-sm mb-2"}`}
            >
                {product.name}
            </h3>

            {/* Phần giá + Nút Add */}
            <div className="mt-auto flex items-end justify-between">
                {/* [ĐÃ SỬA LỖI QUÊN PROP]: Nhớ truyền isCompact vào nhé */}
                <PriceDisplay
                    minPrice={product.minPrice}
                    maxPrice={product.maxPrice}
                    isCompact={isCompact}
                />

                <button
                    onClick={(e) => e.preventDefault()}
                    className={`rounded-full bg-[#f4f9f0] text-[#8cc63f] flex items-center justify-center group-hover:bg-[#8cc63f] group-hover:text-white transition-colors shrink-0
            ${isCompact ? "w-7 h-7" : "w-8 h-8"}`}
                >
                    <Plus size={isCompact ? 16 : 18} />
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
