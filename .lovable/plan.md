
## Fix: Text overflow on referral link

The `<code>` element displaying the referral URL overflows its container because flex items have `min-width: auto` by default, preventing `truncate` from working properly.

### Change

**`src/pages/Success.tsx`** (line 332-333):
- Add `min-w-0` to the flex container `div` (line 332) so `truncate` on the `<code>` element works correctly
- Also add `overflow-hidden` to the `flex-1` parent div (line 324) for safety

Two classes to add:
1. Line 324: `<div className="flex-1 min-w-0">` — prevent parent from expanding
2. Line 332: `<div className="mt-3 flex items-center gap-2 min-w-0">` — allow truncation in flex child
