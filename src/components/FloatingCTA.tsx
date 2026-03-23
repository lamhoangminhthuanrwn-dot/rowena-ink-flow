import { Link } from "react-router-dom";

const FloatingCTA = () => (
  <div className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 md:hidden">
    <Link
      to="/dat-lich"
      className="inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-lg transition-transform hover:scale-105"
    >
      BOOK NOW
    </Link>
  </div>
);

export default FloatingCTA;
