

## Plan: Thêm React.StrictMode vào main.tsx

### Thay đổi

**Sửa `src/main.tsx`** — bọc `<App />` trong `<React.StrictMode>`:

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### Tóm tắt
- **1 file sửa**: `src/main.tsx`
- Giúp phát hiện side effects, deprecated API, và các vấn đề tiềm ẩn trong development mode

