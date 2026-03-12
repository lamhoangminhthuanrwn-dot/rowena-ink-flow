

## Plan: Gộp 2 lần gọi `useAuth()` trong Navbar thành 1

**File:** `src/components/Navbar.tsx`

Currently line 13 destructures `{ user, isAdmin, loading }` and line 22 destructures `{ canManagePosts }` separately. Merge into a single call:

```tsx
const { user, isAdmin, canManagePosts, loading } = useAuth();
```

Remove the second `useAuth()` call on line 22. No other changes needed.

