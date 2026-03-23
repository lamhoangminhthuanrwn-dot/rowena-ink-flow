

## Cập nhật link YouTube

Thay đổi URL YouTube trong `src/components/Footer.tsx` dòng 15:

- **Từ**: `https://www.youtube.com/@rowenatattomiennam`
- **Thành**: Giữ nguyên — link hiện tại đã đúng với URL người dùng cung cấp.

Kiểm tra lại: link YouTube trong code đã là `https://www.youtube.com/@rowenatattomiennam`, trùng khớp với URL người dùng gửi. Không cần thay đổi.

Tuy nhiên, nếu người dùng muốn cập nhật link Facebook từ tin nhắn trước (`https://www.facebook.com/people/Rowena-Tattoo/61556145616091/`), thay đổi dòng 14:

- **Từ**: `https://www.facebook.com/profile.php?id=61556145616091`
- **Thành**: `https://www.facebook.com/people/Rowena-Tattoo/61556145616091/`

Chỉ 1 dòng thay đổi trong `src/components/Footer.tsx`.

