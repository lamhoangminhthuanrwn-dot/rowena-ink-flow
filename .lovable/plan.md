

## Plan: Cấu hình mặc định cho QueryClient

### Thay đổi

**Sửa `src/App.tsx` — dòng 29**

Thêm `defaultOptions` cho QueryClient:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 phút
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Lý do
- `staleTime: 5m` — giảm request thừa, data như catalog/posts không cần refetch liên tục
- `retry: 1` — tránh retry 3 lần mặc định khi API lỗi, UX nhanh hơn
- `refetchOnWindowFocus: false` — không refetch mỗi khi user quay lại tab

### Tóm tắt
- **1 file sửa**: `src/App.tsx` (1 dòng → 8 dòng)

