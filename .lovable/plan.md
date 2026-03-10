

## Thêm lưu ý về số buổi phụ thuộc độ chịu đau

Thêm dòng lưu ý: *"Số buổi thực hiện phụ thuộc vào độ chịu đau của khách hàng (ủ tê chỉ giảm 1 phần sát thương 50-80%)"* vào 2 vị trí:

### 1. `src/pages/ProductDetail.tsx`
- Thêm một dòng lưu ý cố định ngay dưới bảng giá chi tiết (sau price table, trước `design.note`), dùng icon `Info` + style `bg-amber-50` để nổi bật.

### 2. `src/components/BookingOptionStep.tsx`
- Thêm dòng lưu ý tương tự ngay dưới phần hiển thị giá ước tính (sau price display block, trước `</div>` cuối).

Cả hai nơi sẽ dùng cùng một đoạn text và style nhất quán.

