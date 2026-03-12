

## Plan: Sắp xếp lại thứ tự link tags trong index.html

**File:** `index.html`, lines 7-11

Di chuyển `preconnect` lên trước `stylesheet` để trình duyệt thiết lập kết nối sớm hơn:

```html
<!-- Before -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:..." />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Pro:..." />
<link rel="canonical" href="..." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- After -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:..." />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Pro:..." />
<link rel="canonical" href="..." />
```

**1 file, chỉ thay đổi thứ tự dòng.**

