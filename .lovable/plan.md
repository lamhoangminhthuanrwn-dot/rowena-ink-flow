

## Bắt buộc nhập giá trước khi hoàn thành đơn

### Thay đổi

**`src/pages/Ketoan.tsx`**:

1. Trong hàm `markCompleted`: thêm check `total_price` của booking. Nếu `total_price` là null hoặc 0, hiển thị toast lỗi yêu cầu nhập giá trước, không cho tiếp tục.

2. Tại nút "Hoàn thành" (dòng 571-579): thêm điều kiện disable hoặc ẩn nút nếu `b.total_price` chưa có, kèm tooltip giải thích.

### Logic cụ thể

```typescript
const markCompleted = async (id: string) => {
  const booking = bookings.find(b => b.id === id);
  if (!booking?.total_price || booking.total_price <= 0) {
    toast.error("Vui lòng nhập giá trị đơn hàng trước khi hoàn thành.");
    return;
  }
  // ... existing logic
};
```

### Files thay đổi
- `src/pages/Ketoan.tsx` - thêm validation trong `markCompleted` và disable nút khi chưa có giá

