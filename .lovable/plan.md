

## Plan

### Add "Chi nhánh" and "Thợ xăm" columns to the bookings table in Ketoan

**File: `src/pages/Ketoan.tsx`**

1. **Update the query** (line 54): Join with `artists` table to get artist name:
   - Change `.select("*")` to `.select("*, artists(name)")` 

2. **Add two table headers** after "Ngày" column (line 324):
   - `<th>Chi nhánh</th>`
   - `<th>Thợ xăm</th>`

3. **Add two table cells** after the date cell (after line 347):
   - Chi nhánh: display `b.branch_name || "—"`
   - Thợ xăm: display `b.artists?.name || "—"`

4. **Update expanded row colspan** (line 483): Change `colSpan={7}` to `colSpan={9}`

