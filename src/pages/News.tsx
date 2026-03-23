import { useState, useEffect } from "react";
import { setSEO, resetSEO } from "@/lib/seo";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const categories = ["Tất cả", "Tin tức", "Khuyến mãi", "Kiến thức xăm", "Aftercare"];

const News = () => {
  const [active, setActive] = useState("Tất cả");

  useEffect(() => {
    setSEO({
      title: "Tin tức & Khuyến mãi",
      description: "Cập nhật mới nhất từ ROWENA — khuyến mãi, kiến thức xăm và nhiều hơn nữa",
    });
    return () => resetSEO();
  }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, cover_image, category, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = active === "Tất cả" ? posts : posts.filter((p) => p.category === active);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="font-serif text-4xl font-bold uppercase tracking-tight text-foreground">TIN TỨC & KHUYẾN MÃI</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Cập nhật mới nhất từ ROWENA
          </p>
        </motion.div>

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`border px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest transition-all ${
                active === c
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              [{c.toUpperCase()}]
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border border-border bg-card">
                <div className="aspect-[16/9] bg-secondary" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-secondary" />
                  <div className="h-5 w-3/4 bg-secondary" />
                  <div className="h-3 w-full bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-border bg-card p-12 text-center">
            <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Link
                  to={`/tin-tuc/${post.slug}`}
                  className="group block overflow-hidden border border-border bg-card transition-all duration-300 hover:border-primary"
                >
                  {post.cover_image ? (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="h-full w-full object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-secondary flex items-center justify-center">
                      <span className="font-serif text-3xl font-bold text-primary/20">R</span>
                    </div>
                  )}
                  <div className="p-5 border-t border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                        [{post.category}]
                      </span>
                      {post.published_at && (
                        <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          <Calendar size={10} />
                          {format(new Date(post.published_at), "dd MMM yyyy", { locale: vi })}
                        </span>
                      )}
                    </div>
                    <h3 className="font-sans text-base font-bold uppercase text-foreground line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-primary transition-all group-hover:gap-2">
                      ĐỌC THÊM <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
