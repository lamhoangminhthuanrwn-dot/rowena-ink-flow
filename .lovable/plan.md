

## Đổi tông màu giao diện từ đen sang xám

Chuyển nền và các bề mặt từ tông đen (#050505, #121212) sang tông xám nhạt hơn để bớt u tối, vẫn giữ phong cách brutalist.

### Thay đổi CSS variables trong `src/index.css`

| Token | Hiện tại (đen) | Mới (xám) |
|-------|----------------|-----------|
| `--background` | `0 0% 2%` | `0 0% 10%` (~#1a1a1a) |
| `--card` | `0 0% 7%` | `0 0% 15%` (~#262626) |
| `--popover` | `0 0% 7%` | `0 0% 15%` |
| `--secondary` | `0 0% 12%` | `0 0% 20%` (~#333) |
| `--accent` | `0 0% 7%` | `0 0% 15%` |
| `--sidebar-background` | `0 0% 2%` | `0 0% 10%` |
| `--sidebar-accent` | `0 0% 12%` | `0 0% 20%` |
| `surface` color | `#121212` | `#222222` |

Cập nhật cả block `:root` và `.dark` trong `index.css`, và giá trị `surface` trong `tailwind.config.ts`.

Giữ nguyên: foreground trắng, primary đỏ, muted, border, typography, layout.

