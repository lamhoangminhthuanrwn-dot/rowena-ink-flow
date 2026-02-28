import { Link } from "react-router-dom";

const FloatingCTA = () => {
  return (
    <div className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2">
      <Link
        to="/booking"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105"
      >
        Đặt lịch xăm
      </Link>
    </div>
  );
};

export default FloatingCTA;
