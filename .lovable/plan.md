

## Plan: Xóa "Xong trong ngày" cho vị trí Trắng đen của Xăm full ngực hoặc full bụng

### Changes in `src/data/tattooDesigns.ts`

**Update `makeScheduleOptions` function** (line 47-53): Filter out the "Xong trong ngày" option when `sameDayPrice` is 0 or undefined.

```typescript
function makeScheduleOptions(p: FullBodyPricing): ScheduleOption[] {
  const options: ScheduleOption[] = [
    { label: "Trả hết 1 lần", price: p.fullPrice, sessions: p.fullSessions },
    { label: "Trả theo buổi", price: p.perSessionPrice, sessions: p.perSessionSessions, isPerSession: true },
  ];
  if (p.sameDayPrice > 0) {
    options.push({ label: "Xong trong ngày", price: p.sameDayPrice, note: p.sameDayNote });
  }
  return options;
}
```

This leverages the existing `sameDayPrice: 0` already set for BW of design "4", so no other data changes needed.

