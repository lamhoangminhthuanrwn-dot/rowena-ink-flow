

## Plan: Đưa Google Maps lên ngang hàng với thông tin footer

### Phân tích
Hiện tại, phần bản đồ Google Maps nằm riêng biệt phía dưới grid 4 cột thông tin footer. User muốn đưa bản đồ lên ngang hàng cùng dòng với các cột thông tin.

### Thay đổi

**File: `src/components/Footer.tsx`**

1. Chuyển layout từ grid 4 cột (`lg:grid-cols-4`) sang grid 5 cột (`lg:grid-cols-5`), trong đó bản đồ chiếm 2 cột (`lg:col-span-2`)

2. Di chuyển phần Google Maps (branch selector + iframe + address) vào bên trong grid chính, thay vì để riêng phía dưới

3. Bỏ phần `<div className="mt-10">` bọc maps riêng, thay bằng một grid item nằm trong cùng grid với Brand, Liên kết, Liên hệ, Studio

### Chi tiết kỹ thuật
- Grid layout: `sm:grid-cols-2 lg:grid-cols-5`
- 3 cột đầu (Brand, Liên kết, Liên hệ) giữ nguyên mỗi cột 1 phần
- Bỏ cột Studio Info riêng (vì thông tin đã có trong maps section)
- Cột maps chiếm `lg:col-span-2` để có đủ không gian hiển thị bản đồ và branch selector

