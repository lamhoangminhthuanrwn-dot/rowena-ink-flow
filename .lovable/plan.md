

## Thiết kế lại thanh lọc danh mục — tinh tế hơn

### Hiện tại
Các nút filter dạng `[TẤT CẢ]` với dấu ngoặc vuông, font mono bold, khá thô.

### Thiết kế mới
Chuyển sang dạng tab tối giản với hiệu ứng underline animated, bỏ dấu ngoặc vuông:

- Font: `font-sans` thay vì `font-mono`, cỡ chữ `text-xs`, `tracking-[0.2em]`, `uppercase`
- Nút active: có gạch chân đỏ (2px) bên dưới bằng pseudo-element hoặc `border-bottom`, text màu `foreground`
- Nút inactive: text `muted-foreground`, hover chuyển sang `foreground`
- Bỏ dấu `[ ]` quanh text
- Thêm `overflow-x-auto` + `no-scrollbar` cho mobile để cuộn ngang mượt
- Giữ sticky behavior và vị trí hiện tại

### Thay đổi file

**`src/pages/Catalog.tsx`** — chỉ sửa phần filter bar (dòng 12-27):
```tsx
<div className="sticky top-16 z-40 border-b border-border/50 bg-background/95 backdrop-blur-sm w-full">
  <div className="mx-auto flex max-w-[1440px] gap-8 px-6 md:px-10 overflow-x-auto no-scrollbar">
    {categories.map((c) => (
      <button
        key={c}
        onClick={() => setActive(c)}
        className={`relative py-4 font-sans text-xs uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${
          active === c
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {c}
        {active === c && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
        )}
      </button>
    ))}
  </div>
</div>
```

Điểm khác biệt: backdrop-blur nhẹ, underline indicator thay vì bracket, font sans thanh lịch hơn, spacing rộng rãi hơn.

