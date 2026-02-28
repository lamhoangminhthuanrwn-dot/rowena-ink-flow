

## Analysis

The domain `notify.thuanlam.id.vn` is verified. The issue causing emails to land in spam is the **domain mismatch** between `FROM_DOMAIN` and `SENDER_DOMAIN`:

- `SENDER_DOMAIN = "notify.thuanlam.id.vn"` (actual sending infrastructure)
- `FROM_DOMAIN = "thuanlam.id.vn"` (domain in the From header)

When SPF/DKIM are set up on `notify.thuanlam.id.vn` but the From address says `noreply@thuanlam.id.vn`, the domains don't align. Email providers (Gmail, Outlook) see this as a failed alignment and flag the message as spam.

## Plan

### Fix FROM_DOMAIN to match SENDER_DOMAIN

**File: `supabase/functions/auth-email-hook/index.ts`**
- Change `FROM_DOMAIN` from `"thuanlam.id.vn"` to `"notify.thuanlam.id.vn"`
- Result: From address becomes `Rowena Ink Hub <noreply@notify.thuanlam.id.vn>`
- This ensures SPF/DKIM alignment, improving inbox delivery

### Re-deploy edge function

- Deploy `auth-email-hook` after the change

