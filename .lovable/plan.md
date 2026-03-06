

## Plan: Thông báo popup realtime cho admin khi có booking mới

### Hiện trạng
- Realtime đã được bật cho bảng `bookings` (migration đã có `ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings`)
- Email notification đã hoạt động qua edge function `send-booking-email`
- Chưa có realtime subscription nào trong frontend

### Giải pháp

**1. Tạo component `AdminBookingNotifier`** (`src/components/AdminBookingNotifier.tsx`)
- Chỉ render khi user là admin (`isAdmin` từ `useAuth`)
- Subscribe vào Supabase Realtime channel trên bảng `bookings`, lắng nghe event `INSERT`
- Khi có booking mới, hiển thị toast notification (sonner) với thông tin: mã booking, tên khách, thiết kế
- Toast có nút bấm để chuyển đến trang `/ketoan`

**2. Đặt component vào `App.tsx`**
- Thêm `<AdminBookingNotifier />` bên trong `<AuthProvider>` để có access đến auth context
- Component tự kiểm tra `isAdmin`, không render gì nếu không phải admin

### Chi tiết kỹ thuật

```tsx
// AdminBookingNotifier.tsx - pseudo code
const AdminBookingNotifier = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAdmin) return;
    
    const channel = supabase
      .channel('admin-booking-alerts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        (payload) => {
          const booking = payload.new;
          toast(`Booking mới: ${booking.booking_code}`, {
            description: `${booking.customer_name} - ${booking.product_name}`,
            action: { label: 'Xem', onClick: () => navigate('/ketoan') }
          });
        }
      )
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);
  
  return null;
};
```

Email đã được gửi tự động khi booking được tạo (trong `Success.tsx`), không cần thay đổi gì thêm cho phần email.

