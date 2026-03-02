

## Plan: Add realtime markdown preview to content editor

### Problem
The content editor is a plain textarea with no visual feedback. Users can't see how their markdown will render until they publish the post.

### Approach
Add a toggle between "Viết" (Write) and "Xem trước" (Preview) tabs above the content textarea. When in preview mode, render the markdown content using the existing `formatContent` function from `NewsDetail.tsx`.

### Changes

1. **Extract `formatContent` to a shared utility**
   - Move `formatContent` from `src/pages/NewsDetail.tsx` into a new file `src/lib/formatContent.ts`
   - Import it in both `NewsDetail.tsx` and `AdminPosts.tsx`

2. **Update `src/pages/AdminPosts.tsx`**
   - Add a `previewMode` boolean state
   - Add "Viết" / "Xem trước" toggle buttons next to the "Chèn ảnh" button
   - When preview is active, replace the textarea with a styled div rendering the content via `formatContent` + `dangerouslySetInnerHTML`
   - When write is active, show the existing textarea as-is
   - The textarea and preview share the same height/styling area

3. **Update `src/pages/NewsDetail.tsx`**
   - Replace the local `formatContent` with the import from the shared utility

No database or backend changes needed.

