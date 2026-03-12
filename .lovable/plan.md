

## Plan: Thêm loading fallback cho Suspense

**File:** `src/App.tsx`, line 43

Thay `fallback={null}` bằng một spinner/loading indicator đơn giản, centered trong viewport:

```tsx
<Suspense fallback={
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
}>
```

Dùng CSS spinner thuần Tailwind, không cần thêm component hay dependency. Đảm bảo user thấy loading state thay vì màn hình trống khi lazy route đang tải.

**1 file sửa, 0 file tạo mới.**

