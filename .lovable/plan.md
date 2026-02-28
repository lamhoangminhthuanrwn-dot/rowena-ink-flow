

## Problem

The `branches` and `artists` tables have **RESTRICTIVE** RLS policies that conflict. The "Admins can manage branches/artists" policy (FOR ALL, RESTRICTIVE) requires admin role for ALL operations including SELECT. Since RESTRICTIVE policies ALL must pass, even though "viewable by everyone" allows SELECT, the admin-only policy blocks non-admin and anonymous users. Additionally, when the component mounts, the auth session may not be restored yet, causing even admin requests to fail.

## Fix

### 1. Fix RLS policies via migration

**Drop conflicting RESTRICTIVE policies and recreate as PERMISSIVE:**

For `branches`:
- Drop "Admins can manage branches" (FOR ALL, RESTRICTIVE)
- Create PERMISSIVE "Admins can insert branches" (INSERT)
- Create PERMISSIVE "Admins can update branches" (UPDATE)
- Change "Branches viewable by everyone" to PERMISSIVE

For `artists`:
- Drop "Admins can manage artists" (FOR ALL, RESTRICTIVE)
- Create PERMISSIVE "Admins can insert artists" (INSERT)
- Create PERMISSIVE "Admins can update artists" (UPDATE)
- Change "Artists viewable by everyone" to PERMISSIVE

### 2. No code changes needed

The Booking.tsx component code is correct. Once RLS allows anonymous/non-admin SELECT, branches will render properly.

