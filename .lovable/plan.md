

## Plan: Bỏ dòng tổng số buổi khi chọn "Trả theo buổi"

### Changes in `src/components/BookingOptionStep.tsx`

**Price display section (lines 274-283)**: When `perSession` is selected, remove the line showing "Tổng X buổi thực hiện: Y đ" — only show `3.500.000đ / buổi`.

```tsx
// Before
<p className="text-2xl font-bold text-primary">
  {formatVNDShort(displayFinalPrice.perSession)}
  <span className="text-base font-normal text-muted-foreground"> / buổi</span>
</p>
<p className="mt-1 text-xs text-muted-foreground">
  Tổng {displayFinalPrice.sessions} buổi thực hiện: {formatVNDShort(displayFinalPrice.total)}
</p>

// After
<p className="text-2xl font-bold text-primary">
  {formatVNDShort(displayFinalPrice.perSession)}
  <span className="text-base font-normal text-muted-foreground"> / buổi</span>
</p>
```

Single line removal, no other changes needed.

