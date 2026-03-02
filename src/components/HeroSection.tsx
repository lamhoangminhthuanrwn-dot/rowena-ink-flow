import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-tattoo.jpg";

const HeroSection = () => (
  <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
    <img
      src={heroImg}
      alt="Tattoo artist working in studio"
      className="absolute inset-0 h-full w-full object-cover"
      loading="eager"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />

    <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-6 font-sans text-5xl font-bold leading-tight text-foreground md:text-7xl"
      >
        Nghệ thuật<br />
        <span className="italic text-primary">trên da</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
      >
        Mỗi hình xăm là một câu chuyện. Để ROWENA kể câu chuyện của bạn với sự tỉ mỉ và đam mê tuyệt đối.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
      >
        <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 font-semibold uppercase tracking-wider shadow-lg shadow-primary/25">
          <Link to="/booking">Đặt lịch xăm</Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="rounded-full border-primary/30 px-8 font-semibold uppercase tracking-wider text-primary hover:bg-primary/10">
          <Link to="/catalog">Xem mẫu & giá</Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;