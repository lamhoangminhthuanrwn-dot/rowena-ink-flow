

## Current State

All tables, RLS policies, RPCs, and the storage bucket **already exist** in the database. The two missing pieces are:

1. **Triggers are not attached** — the functions `handle_new_user()` and `handle_new_profile_wallet()` exist but have no triggers connecting them to their respective tables.
2. **Admin role for admin@rowena.vn** — the user `admin@rowena.vn` has not signed up yet, so there's no `auth.users` row to reference. We cannot insert into `user_roles` until they register.

## Plan

### Step 1: Create missing triggers via migration

Run a migration to attach:
- `handle_new_user()` → `AFTER INSERT ON auth.users` (creates profile + captures referral)
- `handle_new_profile_wallet()` → `AFTER INSERT ON profiles` (creates wallet row)

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_wallet();
```

### Step 2: Auto-assign admin role for admin@rowena.vn

Since the user hasn't registered yet, create a trigger that automatically inserts an admin role when `admin@rowena.vn` signs up:

```sql
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'admin@rowena.vn' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_admin();
```

This way, when `admin@rowena.vn` registers, they automatically get the admin role. No manual intervention needed.

### Technical Details

- The `on_auth_user_created` trigger on `auth.users` is allowed because it only references the `public` schema functions — it doesn't modify the `auth` schema structure.
- Both `handle_new_user` and `auto_assign_admin` fire `AFTER INSERT` on `auth.users` independently.
- If `admin@rowena.vn` has already registered in the future, we can also run a one-time INSERT manually.

