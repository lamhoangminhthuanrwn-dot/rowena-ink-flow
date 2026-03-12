

## Plan: Lazy-fetch data theo tab active trong Account.tsx

### Vấn đề
4 Supabase queries chạy đồng thời khi mount, dù user chỉ xem 1 tab. Lãng phí bandwidth và quota.

### Giải pháp
Fetch data theo tab đang active, dùng `react-query` (đã có trong project) để cache — chuyển tab lần 2 không re-fetch.

### Thay đổi

**Sửa `src/pages/Account.tsx`**

1. Thay 4 `useEffect` queries bằng 3 `useQuery` hooks với `enabled` gắn vào tab:
   - `useQuery("bookings")` — `enabled: tab === "bookings" && !!user`
   - `useQuery("wallet")` + `useQuery("withdrawals")` + `useQuery("transactions")` — `enabled: tab === "wallet" && !!user`
   - Tab "referral" không cần query (dùng `profile` từ AuthContext)

2. Sau khi withdraw thành công, `invalidateQueries` để refetch wallet + withdrawals

3. Xóa state `bookings`, `wallet`, `transactions`, `withdrawals` — data đến từ `useQuery().data`

### Tóm tắt
- **1 file sửa**
- Data chỉ fetch khi tab được chọn lần đầu, sau đó cache bởi react-query
- Withdraw thành công → invalidate để refetch

