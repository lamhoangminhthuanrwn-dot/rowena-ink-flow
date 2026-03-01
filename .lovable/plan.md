

## Thay ảnh Unsplash phù hợp với từng dịch vụ xăm

Cập nhật URL ảnh trong `src/data/tattooDesigns.ts` — chọn ảnh Unsplash thực sự khớp với từng loại dịch vụ:

| Dịch vụ | Ảnh mới |
|---------|---------|
| Xăm full lưng | Ảnh hình xăm full lưng thật |
| Xăm full tay | Ảnh tattoo sleeve trên cánh tay |
| Xăm full chân | Ảnh tattoo trên chân |
| Xăm full ngực | Ảnh tattoo vùng ngực |
| Xăm full bụng | Ảnh tattoo vùng bụng/hông |
| Cover hình xăm cũ | Ảnh cover-up tattoo (trước/sau) |
| Xăm hình mini & A4 | Ảnh mini tattoo nhỏ xinh |
| Xăm che sẹo | Ảnh scar cover tattoo |
| Xăm theo yêu cầu | Ảnh custom tattoo design/artist |

### Thay đổi
1. **`src/data/tattooDesigns.ts`**: Thay 9 URL ảnh Unsplash bằng ảnh phù hợp hơn với từng dịch vụ. Một số ảnh hiện tại bị trùng lặp (id 1 & 7, id 2 & 8, id 3 & 9) — sẽ đảm bảo mỗi dịch vụ có ảnh riêng biệt.

