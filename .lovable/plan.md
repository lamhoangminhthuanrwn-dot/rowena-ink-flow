

## Plan: Thêm nhiều vị trí studio lên Google Maps trong Footer

### Phân tích
Google Maps embed iframe chỉ hỗ trợ hiển thị 1 vị trí. Để hiển thị 4 chi nhánh, sẽ dùng tabs/buttons cho phép chuyển đổi giữa các vị trí trên bản đồ.

### Thay đổi

**File: `src/components/Footer.tsx`**

1. Chuyển Footer từ functional component sang component có state (`useState`) để quản lý chi nhánh đang được chọn

2. Định nghĩa mảng 4 chi nhánh với tên, địa chỉ, và Google Maps embed URL:
   - **Gò Vấp, HCM**: 99 đường số 18, Phường 8, Quận Gò Vấp
   - **Hà Đông, Hà Nội**: Sh41 KPark Văn Phú, Phú La, Hà Đông
   - **Buôn Ma Thuột**: 250 Trần Phú, Buôn Ma Thuột, Đắk Lắk
   - **Kuala Lumpur**: Level 1, Lot F112, Sungei Wang Plaza, Jalan Sultan Ismail

3. Thêm hàng buttons/chips phía trên iframe để chọn chi nhánh, button active có style `bg-primary text-primary-foreground`

4. Iframe `src` thay đổi theo chi nhánh được chọn, dùng Google Maps embed search mode (`/maps/embed/v1/place?q=...` hoặc URL encode địa chỉ)

5. Hiển thị địa chỉ đầy đủ của chi nhánh đang chọn phía dưới bản đồ

### Chi tiết kỹ thuật
- Mỗi embed URL dùng dạng: `https://www.google.com/maps/embed?pb=...` hoặc `https://maps.google.com/maps?q=ENCODED_ADDRESS&output=embed`
- State: `const [activeBranch, setActiveBranch] = useState(0)`
- Buttons dùng style từ existing design system (border, rounded, hover effects)

