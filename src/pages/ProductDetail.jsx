import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, ChevronRight, Check, Minus, Plus, Loader2 } from "lucide-react";
import { productService } from "@/services/productService";
import { toppingService } from "@/services/toppingService";
import { formatCurrency } from "@/utils/formatters";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-toastify";
import { getGuestSessionId } from "@/utils/cartHelper";
import { cartService } from "@/services/cartService";

const ProductDetail = () => {
    const { slug } = useParams(); // Lấy slug từ URL
    const { user } = useAuth();
    const { fetchCart } = useCart();

    // States lưu trữ dữ liệu API
    const [product, setProduct] = useState(null);
    const [availableToppings, setAvailableToppings] = useState([]);
    const [loading, setLoading] = useState(true);

    // States quản lý tương tác người dùng
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState([]); // Mảng chứa các topping

    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productRes, toppingRes] = await Promise.all([
                    productService.getProductBySlug(slug),
                    toppingService.getActiveToppings(),
                ]);

                if (productRes.status === 200) {
                    const productData = productRes.data;
                    setProduct(productData);

                    // Tự động chọn Variant rẻ nhất (Size M) làm mặc định
                    if (
                        productData.variants &&
                        productData.variants.length > 0
                    ) {
                        const cheapestVariant = productData.variants.reduce(
                            (prev, curr) =>
                                prev.price < curr.price ? prev : curr,
                        );
                        setSelectedVariant(cheapestVariant);
                    }
                }

                if (toppingRes.status === 200) {
                    setAvailableToppings(toppingRes.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu chi tiết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // Xử lý khi tick/bỏ tick Topping
    const handleToppingToggle = (topping) => {
        setSelectedToppings((prev) => {
            const isAlreadySelected = prev.find((t) => t.id === topping.id);
            if (isAlreadySelected) {
                return prev.filter((t) => t.id !== topping.id); // Bỏ tick
            } else {
                return [...prev, topping]; // Thêm tick
            }
        });
    };

    // Hàm xử lý tăng giảm số lượng
    const handleQuantityChange = (type) => {
        if (type === "decrease" && quantity > 1) {
            setQuantity((prev) => prev - 1);
        } else if (type === "increase" && quantity < 20) {
            // Giới hạn mua 20 ly 1 lúc tránh spam
            setQuantity((prev) => prev + 1);
        }
    };

    // TÍNH TỔNG TIỀN PHẢI NHÂN VỚI SỐ LƯỢNG
    const calculateTotalPrice = () => {
        if (!selectedVariant) return 0;
        const toppingsTotal = selectedToppings.reduce(
            (sum, topping) => sum + topping.price,
            0,
        );
        return (selectedVariant.price + toppingsTotal) * quantity;
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            toast.warning("Vui lòng chọn size sản phẩm!");
            return;
        }

        try {
            setIsAdding(true);

            // Đóng gói DTO giống hệt Backend yêu cầu
            const payload = {
                variantId: selectedVariant.id,
                quantity: quantity,
                sessionId: user ? null : getGuestSessionId(), // Nếu vô danh thì lấy mã ảo
                toppings: selectedToppings.map((t) => ({
                    toppingId: t.id,
                    quantity: 1, // Mặc định mỗi topping tick chọn là 1 phần
                })),
            };

            const response = await cartService.addToCart(payload);

            if (response.status === 200) {
                toast.success("Đã thêm món vào giỏ hàng!");

                // Gọi Context tải lại giỏ hàng để số đếm trên Navbar nảy lên ngay lập tức!
                await fetchCart();

                // (Tùy chọn) Đặt lại form nếu muốn
                // setQuantity(1);
                // setSelectedToppings([]);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(
                    error.response.data.message ||
                        "Không thể thêm vào giỏ hàng",
                );
            } else {
                toast.error("Lỗi kết nối đến máy chủ");
            }
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[#8cc63f]">
                Đang pha chế...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Sản phẩm không tồn tại!
            </div>
        );
    }

    return (
        <div className="bg-[#f8f9fa] min-h-screen pb-20 font-sans">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100 shadow-sm py-3 mb-8">
                <div className="container mx-auto max-w-5xl px-4 flex items-center text-sm text-gray-500">
                    <Link to="/" className="hover:text-[#8cc63f]">
                        Trang chủ
                    </Link>
                    <ChevronRight size={14} className="mx-2" />
                    <Link to="/menu" className="hover:text-[#8cc63f]">
                        Menu
                    </Link>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="text-gray-900 font-bold">
                        {product.name}
                    </span>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4">
                {/* THẺ SẢN PHẨM CHÍNH */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col md:flex-row gap-10">
                    {/* Cột trái: Hình ảnh */}
                    <div className="w-full md:w-2/5 shrink-0">
                        <div className="bg-[#eaf5dd] rounded-2xl p-6 aspect-square flex items-center justify-center relative overflow-hidden">
                            <img
                                src={
                                    product.defaultImage ||
                                    "https://images.unsplash.com/photo-1558857563-b37102e99e00?auto=format&fit=crop&w=600&q=80"
                                }
                                alt={product.name}
                                className="w-full h-full object-contain hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Cột phải: Thông tin & Lựa chọn */}
                    <div className="w-full md:w-3/5 flex flex-col">
                        {/* Header: Tên & Đánh giá */}
                        <div className="mb-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                                {product.name}
                            </h1>
                            <div className="flex items-center text-sm mb-4">
                                {/* Dải 5 ngôi sao */}
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, index) => {
                                        // Logic: Nếu index < điểm trung bình (đã làm tròn) thì tô màu vàng, ngược lại để viền xám
                                        const isFilled =
                                            index <
                                            Math.round(
                                                product.averageRating || 0,
                                            );
                                        return (
                                            <Star
                                                key={index}
                                                size={18}
                                                fill={
                                                    isFilled
                                                        ? "#e6b800"
                                                        : "none"
                                                } // Tô kín nếu đạt điểm
                                                className={
                                                    isFilled
                                                        ? "text-[#e6b800]"
                                                        : "text-gray-300"
                                                } // Màu viền
                                            />
                                        );
                                    })}
                                </div>

                                {/* Điểm số & Số lượt đánh giá */}
                                <span className="ml-2 font-bold text-gray-800 text-base">
                                    {product.averageRating}
                                </span>
                                <span className="text-gray-300 font-normal mx-2">
                                    |
                                </span>
                                <span className="text-gray-500 font-normal">
                                    {product.reviewCount} đánh giá
                                </span>
                            </div>
                        </div>

                        {/* Giá cơ bản */}
                        <div className="mb-6">
                            <p className="text-gray-500 mb-1 font-medium">
                                Giá cơ bản:
                            </p>
                            <p className="text-2xl font-bold text-[#8cc63f]">
                                {formatCurrency(product.basePrice)}
                            </p>
                        </div>

                        <hr className="border-gray-100 mb-6" />

                        {/* CHỌN SIZE */}
                        <div className="mb-6">
                            <p className="text-gray-700 font-medium mb-3">
                                Chọn size:
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {product.variants?.map((variant) => {
                                    const isSelected =
                                        selectedVariant?.id === variant.id;
                                    // Tính tiền chênh lệch so với giá cơ bản
                                    const priceDiff =
                                        variant.price - product.basePrice;

                                    return (
                                        <button
                                            key={variant.id}
                                            onClick={() =>
                                                setSelectedVariant(variant)
                                            }
                                            className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all flex items-center gap-2
                        ${
                            isSelected
                                ? "bg-[#8cc63f] border-[#8cc63f] text-white shadow-md shadow-green-200"
                                : "bg-white border-gray-300 text-gray-600 hover:border-[#8cc63f] hover:text-[#8cc63f]"
                        }`}
                                        >
                                            {variant.sizeName}
                                            <span
                                                className={
                                                    isSelected
                                                        ? "text-green-100"
                                                        : "text-gray-400"
                                                }
                                            >
                                                (+{formatCurrency(priceDiff)})
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* CHỌN TOPPING (Checkboxes) */}
                        <div className="mb-8 grow">
                            <p className="text-gray-700 font-medium mb-3">
                                Chọn topping:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {availableToppings.map((topping) => {
                                    const isChecked = selectedToppings.some(
                                        (t) => t.id === topping.id,
                                    );
                                    return (
                                        <label
                                            key={topping.id}
                                            className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors
                        ${isChecked ? "border-[#8cc63f] bg-[#f4f9f0]" : "border-gray-200 hover:border-[#8cc63f]"}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleToppingToggle(topping);
                                            }}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded border flex items-center justify-center mr-3 shrink-0
                        ${isChecked ? "bg-[#8cc63f] border-[#8cc63f]" : "bg-white border-gray-300"}`}
                                            >
                                                {isChecked && (
                                                    <Check
                                                        size={14}
                                                        className="text-white"
                                                    />
                                                )}
                                            </div>
                                            <span className="text-gray-700 text-sm grow">
                                                {topping.name}
                                            </span>
                                            <span className="text-gray-500 text-sm font-medium">
                                                +{formatCurrency(topping.price)}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* BỘ CHỌN SỐ LƯỢNG NẰM NGAY TRÊN KHUNG TỔNG TIỀN */}
                        <div className="mb-6">
                            <p className="text-gray-700 font-medium mb-3">
                                Số lượng:
                            </p>
                            <div className="flex items-center bg-white border border-gray-200 p-1.5 rounded-xl w-max shadow-sm">
                                <button
                                    onClick={() =>
                                        handleQuantityChange("decrease")
                                    }
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="w-14 text-center font-bold text-gray-800 text-lg">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() =>
                                        handleQuantityChange("increase")
                                    }
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8cc63f] hover:bg-green-50 transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        {/* TỔNG TIỀN & BUTTON MUA HÀNG */}
                        <div className="mt-auto bg-gray-50 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100">
                            <div>
                                <p className="text-gray-500 font-medium mb-1">
                                    Tổng cộng:
                                </p>
                                <p className="text-3xl font-bold text-[#8cc63f]">
                                    {formatCurrency(calculateTotalPrice())}
                                </p>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className="w-full sm:w-auto bg-[#8cc63f] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#7ab036] transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isAdding ? (
                                    <>
                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />{" "}
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={20} /> Thêm vào giỏ
                                        hàng
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* KHU VỰC ĐÁNH GIÁ BÌNH LUẬN (UI tĩnh như bản thiết kế) */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Đánh giá & Bình luận
                    </h2>

                    <div className="flex text-gray-300 mb-4 cursor-pointer">
                        <Star
                            size={24}
                            fill="currentColor"
                            className="hover:text-[#e6b800] transition-colors"
                        />
                        <Star
                            size={24}
                            fill="currentColor"
                            className="hover:text-[#e6b800] transition-colors"
                        />
                        <Star
                            size={24}
                            fill="currentColor"
                            className="hover:text-[#e6b800] transition-colors"
                        />
                        <Star
                            size={24}
                            fill="currentColor"
                            className="hover:text-[#e6b800] transition-colors"
                        />
                        <Star
                            size={24}
                            fill="currentColor"
                            className="hover:text-[#e6b800] transition-colors"
                        />
                    </div>

                    <textarea
                        className="w-full border border-gray-200 rounded-xl p-4 text-sm outline-none focus:border-[#8cc63f] focus:ring-1 focus:ring-[#8cc63f] resize-none mb-4"
                        rows="4"
                        placeholder="Nhập bình luận của bạn về món nước này nhé..."
                    ></textarea>

                    <button className="bg-[#1db059] text-white px-8 py-2.5 rounded text-sm font-bold hover:bg-[#18964b] transition-colors shadow-md">
                        Gửi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
