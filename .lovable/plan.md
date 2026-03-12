

## Plan: Bảo vệ file .env khỏi Git

**Lưu ý quan trọng:** File `.env` trong dự án Lovable Cloud được tự động tạo và quản lý bởi hệ thống. Nó chứa các biến công khai (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) -- đây đều là anon key, an toàn khi public.

Tuy nhiên, để tránh thói quen xấu và ngăn việc vô tình commit secret keys trong tương lai:

### Thay đổi

1. **Thêm `.env` vào `.gitignore`** (dòng cuối)
2. **Tạo `.env.example`** với placeholder:
   ```
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   ```

2 file thay đổi, không ảnh hưởng chức năng.

**Lưu ý:** Vì `.env` đã được tracked bởi Git, sau khi thêm vào `.gitignore` cần chạy `git rm --cached .env` để ngừng track. Tuy nhiên trong môi trường Lovable, file `.env` được tự động quản lý nên thay đổi này chủ yếu mang tính phòng ngừa.

