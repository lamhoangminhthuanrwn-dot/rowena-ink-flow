

## Plan: Fix FloatingCTA positioning

The button is already using `fixed bottom-6 left-1/2 -translate-x-1/2` for centering, but it only appears after scrolling 500px. I'll make it always visible and ensure proper centering.

### Changes
**`src/components/FloatingCTA.tsx`**:
- Remove scroll-dependent visibility logic (always show the button)
- Keep `fixed bottom-6 left-1/2 -translate-x-1/2` for centered bottom positioning
- Simplify by removing `useScroll`/`useMotionValueEvent` and the `visible` state

