

## Sửa favicon trên Google hiển thị logo Lovable thay vì logo web

### Vấn đề
Google đang hiển thị logo Lovable (từ `https://lovable.dev/opengraph-image-p98pqg.png`) thay vì logo thực của ROWENA TATTOO CLUB khi tìm kiếm.

### Giải pháp
Cập nhật `index.html` để thay thế Open Graph image và Twitter image từ logo Lovable sang logo thực của website (`/favicon.png`).

### Thay đổi cần thực hiện

**File `index.html`**:
- Thay `og:image` từ `https://lovable.dev/opengraph-image-p98pqg.png` → `https://thuanlam.id.vn/favicon.png`
- Thay `twitter:image` từ `https://lovable.dev/opengraph-image-p98pqg.png` → `https://thuanlam.id.vn/favicon.png`
- Thêm `og:image:width` và `og:image:height` (kích thước favicon 256x256)
- Thêm `og:image:type` là `image/png`

Sau khi cập nhật, Google sẽ cập nhật lại kết quả tìm kiếm trong vài ngày tới.

