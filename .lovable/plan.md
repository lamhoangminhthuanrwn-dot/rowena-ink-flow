

## Plan: Add inline image upload to post content editor

### Problem
Currently the content editor is a plain textarea. Users must manually type image URLs in markdown format. Need a button to upload images and auto-insert markdown at cursor position.

### Changes

1. **`src/pages/AdminPosts.tsx`**
   - Add a second file input ref (`contentImageRef`) for content images
   - Add `handleContentImageUpload` function that:
     - Uploads image to existing `post-images` bucket (same as cover images)
     - Gets public URL
     - Inserts `![image](url)` markdown at the textarea cursor position
   - Add a ref to the content textarea to track cursor position
   - Add an "Chèn ảnh" (Insert image) button above or beside the content textarea label, with an Upload/ImageIcon icon
   - Show uploading state on the button

No database or storage changes needed — the `post-images` bucket already exists with correct RLS policies.

