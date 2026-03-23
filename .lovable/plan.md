

## Xóa thẻ phân loại (category) ở trang chủ

Xóa 2 vị trí hiển thị category trên trang chủ:

### Thay đổi trong `src/pages/Index.tsx`

1. **Dòng 43**: Xóa dòng `<p className="font-mono...">[ {featured[0]?.category} ]</p>` — thẻ category của featured work bên trái.

2. **Dòng 71**: Xóa dòng `<p className="font-mono...">{d.category}</p>` — thẻ category trong danh sách sản phẩm bên phải.

Giữ nguyên tên sản phẩm và giá, chỉ bỏ dòng phân loại.

