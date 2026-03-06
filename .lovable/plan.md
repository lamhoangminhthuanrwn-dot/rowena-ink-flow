

## Plan: Thêm âm thanh thông báo cho admin khi có booking mới

### Giải pháp
Sử dụng Web Audio API để phát một âm thanh "ding" notification ngắn khi admin nhận được booking mới, không cần file audio bên ngoài.

### Changes

**`src/components/AdminBookingNotifier.tsx`**
- Thêm hàm `playNotificationSound()` sử dụng `AudioContext` để tạo tiếng "ding" ngắn (frequency ~800Hz, duration ~0.3s)
- Gọi hàm này trước khi hiển thị toast trong callback realtime

```tsx
const playNotificationSound = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.frequency.value = 800;
  oscillator.type = "sine";
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.5);
};
```

Không cần thêm file, package, hay migration nào.

