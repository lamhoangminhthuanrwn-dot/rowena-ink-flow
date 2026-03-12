

## Plan: Cache Google Maps iframes để tránh flicker khi đổi branch

### Vấn đề
Khi đổi branch, iframe bị unmount/remount → tải lại từ đầu → flicker.

### Giải pháp
Render tất cả 4 iframe cùng lúc (khi `mapVisible = true`), dùng CSS ẩn/hiện thay vì conditional render.

### Thay đổi

**Sửa `src/components/Footer.tsx`** — dòng 123-137

Thay single iframe bằng loop render 4 iframe, dùng `hidden` class để ẩn các branch không active:

```tsx
<div ref={mapRef}>
  {mapVisible ? (
    branches.map((branch, index) => (
      <iframe
        key={branch.name}
        src={`https://maps.google.com/maps?q=${branch.mapQuery}&output=embed`}
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={`rounded-lg border border-border/30 ${index !== activeBranch ? "hidden" : ""}`}
        title={`Vị trí ${branch.name}`}
      />
    ))
  ) : (
    <div className="h-[200px] rounded-lg border border-border/30 bg-secondary/30" />
  )}
</div>
```

### Tóm tắt
- **1 file sửa**, thay đổi nhỏ (~10 dòng)
- Iframe được cache sau lần load đầu, chuyển branch tức thì không flicker
- Tradeoff: load 4 iframe thay vì 1, nhưng `loading="lazy"` + IntersectionObserver giảm thiểu impact

