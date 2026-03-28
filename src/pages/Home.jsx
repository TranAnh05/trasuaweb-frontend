import React, { useState, useEffect } from "react";
import BannerSlider from "../components/layouts/BannerSlider";
import { productService } from "../services/productService";
import { formatCurrency } from "../utils/formatters";
import ProductCard from "@/components/product/ProductCard";
import { Link } from "react-router-dom";

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
                    sort: "newest",
                });

                if (response.status === 200) {
                    setProducts(response.data.content);
                }
            } catch (err) {
                console.error("Lỗi khi tải sản phẩm:", err);
                setError(
                    "Không thể tải danh sách sản phẩm lúc này. Vui lòng thử lại sau.",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchNewProducts();
    }, []); // Array rỗng đảm bảo chỉ gọi 1 lần khi load trang

    // Component hiển thị giá thông minh (Xử lý vụ giá Min - Max)
    const PriceDisplay = ({ minPrice, maxPrice }) => {
        if (minPrice === maxPrice || !maxPrice || maxPrice === 0) {
            return (
                <p className="text-[#8cc63f] text-sm font-bold">
                    {formatCurrency(minPrice)}
                </p>
            );
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
                            Sản phẩm mới của <br />
                            <span className="text-[#8cc63f]">R&B Tea</span>
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Những ly trà mới với hương vị độc đáo tạo nên hương
                            vị rất riêng của R&B Tea mà nhất định bạn phải thử.
                        </p>
                        <Link to={"/menu"} className="border-2 border-[#8cc63f] text-[#8cc63f] font-semibold px-8 py-3 hover:bg-[#8cc63f] hover:text-white transition-colors rounded">
                            Xem toàn bộ Menu
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:gap-6">
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
                        {products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    isCompact={true}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20...">
                                ...
                            </div>
                        )}

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
