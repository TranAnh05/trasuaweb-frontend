# TÀI LIỆU ĐẶC TẢ KỸ THUẬT (TECHNICAL SPECIFICATION)

**Tên tính năng:** Xem Chi tiết Sản phẩm & Tùy chọn mua hàng (Product Detail)
**Mã tính năng:** FEAT-002

---

## 1. Tổng quan (Overview)
Trang Chi tiết Sản phẩm (Product Detail) là điểm chạm cuối cùng trước khi khách hàng đưa ra quyết định mua (Add to Cart). Tính năng này yêu cầu tải toàn bộ thông tin chi tiết của một sản phẩm (hình ảnh, giá bán, tùy chọn size, danh sách topping, thống kê đánh giá) với hiệu suất cao và giao diện tính toán giá tiền (Real-time calculation) mượt mà.

## 2. Phạm vi yêu cầu (Scope & User Stories)
**Khách hàng (Customer) có thể:**
1. Xem thông tin cơ bản: Tên, mô tả, hình ảnh sản phẩm.
2. Nhìn thấy điểm số đánh giá (Rating) trực quan thông qua dải 5 ngôi sao và tổng lượt bình luận.
3. Chọn Size (M, L, XL...): Bắt buộc chọn 1 size. Giao diện hiển thị rõ số tiền chênh lệch so với giá gốc (Ví dụ: `+5.000 đ`).
4. Chọn Topping: Có thể chọn nhiều topping cùng lúc thông qua Checkbox.
5. Thấy Tổng tiền cập nhật ngay lập tức (Real-time) mỗi khi thay đổi Size hoặc Topping.
6. Thêm sản phẩm vào giỏ hàng với đầy đủ dữ liệu tùy chỉnh (Payload).

## 3. Thiết kế luồng nghiệp vụ (Business Logic Flow)

* **Logic "Giá cơ bản" (Base Price):** Backend tự động quét qua tất cả các Size (Variants) của sản phẩm, lấy ra Size có giá thấp nhất để làm Giá cơ bản hiển thị ban đầu nhằm kích thích tâm lý mua hàng.
* **Quy tắc chọn mặc định (Default Selection):** Khi vừa truy cập trang, hệ thống Frontend phải tự động chọn sẵn Size rẻ nhất (thường là Size M) để tránh lỗi null khi khách hàng bấm "Thêm giỏ hàng" luôn mà không chọn gì.
* **Công thức tính Tổng tiền:** `Tổng Tiền = Giá của Size đang chọn + Tổng (Giá các Topping đang được tick)`
* **Công thức tính Tiền chênh lệch Size:** `Tiền hiển thị trên nút = Giá của Size hiện tại - Giá cơ bản`

## 4. Thiết kế Kỹ thuật (Technical Architecture)

### 4.1. Backend (Spring Boot)
* **API Lấy Chi Tiết: `GET /api/v1/products/{slug}`**
  * **Giải pháp Tối ưu (N+1 Query):** Sử dụng `@EntityGraph(attributePaths = {"variants", "variants.size", "images"})` để gom 3 bảng (Products, Variants, Images) vào duy nhất 1 câu SQL `JOIN FETCH`.
  * **Xử lý Cartesian Product:** Đã chuyển đổi kiểu dữ liệu `List` thành `Set` đối với các tập hợp `variants` và `images` trong Entity `Product` để giải quyết dứt điểm ngoại lệ `MultipleBagFetchException` của Hibernate.
  * **Logic Thống kê:** Gọi hàm `AVG()` và `COUNT()` từ `ReviewRepository` để tính điểm số sao trung bình trên Database thay vì kéo toàn bộ dữ liệu lên RAM.
* **API Lấy Topping: `GET /api/v1/toppings`**
  * Tách riêng API lấy Topping để tận dụng bộ nhớ đệm (Cache) ở các phiên bản sau, do Topping là danh sách dùng chung cho toàn hệ thống. Chỉ lấy các topping có `in_stock = 1` và `status = 'active'`.

### 4.2. Frontend (ReactJS + Tailwind CSS)
* **Quản lý Trạng thái Tính toán (Derived State):**
  * Không sử dụng state dư thừa cho `totalPrice`. Tổng tiền được tính toán động ngay bên trong hàm render (`calculateTotalPrice()`) dựa trên `selectedVariant` và `selectedToppings`.
* **Kỹ thuật UI/UX Nổi bật:**
  * **Dynamic Stars Array:** Sử dụng `[...Array(5)].map` kết hợp `Math.round(averageRating)` để render tự động dải 5 ngôi sao (sao vàng/sao xám rỗng) chuẩn xác theo điểm số Database.
  * **Component Variants (Reusability):** Refactor lại `ProductCard.jsx`, tích hợp prop `isCompact`. Cho phép tái sử dụng cùng 1 thẻ sản phẩm nhưng có thể co giãn kích thước linh hoạt (Thẻ to ở trang Menu, thẻ nhỏ `max-w-[240px]` nằm cân đối ở trang Home).

## 5. Tiêu chí nghiệm thu (Acceptance Criteria / Test Cases)

| STT | Kịch bản kiểm thử (Test Case) | Kết quả mong đợi (Expected Result) |
|---|---|---|
| 1 | Truy cập trang chi tiết sản phẩm | Load đầy đủ ảnh, tên, giá cơ bản. Size rẻ nhất được chọn tự động. |
| 2 | Click đổi sang Size lớn hơn (VD: Size L) | Tổng tiền cộng thêm đúng bằng phần chênh lệch giá giữa Size L và Size M. |
| 3 | Tick chọn 2 topping, sau đó bỏ tick 1 topping | Tổng tiền tăng lên khi tick và tự động trừ đi khi bỏ tick mượt mà. |
| 4 | Kiểm tra hiển thị dải Ngôi Sao | Sản phẩm có rating 4.3 -> Hiện 4 sao vàng, 1 sao xám rỗng. |
| 5 | Truy cập trang Home | Khối "Sản phẩm mới" hiển thị các ProductCard thu gọn (compact mode), cấu trúc lưới 2x2 vuông vức, không bị vỡ bố cục. |

---
