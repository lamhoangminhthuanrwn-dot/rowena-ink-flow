

## Plan: Add toast.error for silent failures + ErrorBoundary

### 1. Create `src/components/ErrorBoundary.tsx`

A React class component that catches render errors and displays a fallback UI with a "Tải lại" button. On error, it also fires `toast.error("Đã xảy ra lỗi. Vui lòng tải lại trang.")`.

### 2. Update `src/App.tsx`

Wrap the `<Suspense>` block with `<ErrorBoundary>`:

```tsx
<ErrorBoundary>
  <Suspense fallback={null}>
    <Routes>...</Routes>
  </Suspense>
</ErrorBoundary>
```

### 3. Add `toast.error` to silent `console.error` calls in `src/pages/Success.tsx`

Two places currently only log errors without notifying the user:

- **Line 95** (`Booking insert error`): Add `toast.error("Không thể lưu đơn đặt lịch. Vui lòng thử lại.")`
- **Line 121** (`Insert booking error`): Add `toast.error("Không thể lưu đơn đặt lịch. Vui lòng thử lại.")`

These are the only pages with silent failures — Ketoan, Auth, AdminBranches already have proper toast.error handling.

