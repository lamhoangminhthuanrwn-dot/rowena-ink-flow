

## Plan: Fix post management access and make it visible for admin/moderator

### Current state
The post management page (`/admin/posts`) already exists in `AdminPosts.tsx` with full create/edit/delete functionality. However, there are two issues preventing it from working properly:

### Issue 1: RLS policies are RESTRICTIVE (blocking access)
The `posts` table has RESTRICTIVE policies, which means ALL policies must pass simultaneously. This causes admins/moderators to only see **published** posts (because the "Published posts viewable by everyone" policy fails for drafts, blocking the entire SELECT even though the admin policy passes).

**Fix**: Drop existing RESTRICTIVE policies and recreate them as PERMISSIVE.

### Issue 2: Navigation not visible for admins
The navbar only shows "Bài viết" for moderators who are NOT admin. Admins must navigate through the Ketoan page, which isn't intuitive.

**Fix**: Update `Navbar.tsx` to show "Bài viết" link for all users with `canManagePosts` (both admin and moderator).

### Changes

1. **SQL migration**: Drop and recreate `posts` RLS policies as PERMISSIVE
2. **`src/components/Navbar.tsx`**: Simplify the nav link logic — show "Bài viết" for any user with `canManagePosts`

