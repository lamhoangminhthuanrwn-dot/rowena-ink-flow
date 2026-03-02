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
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="font-sans text-4xl font-bold text-foreground">Tin tức & Khuyến mãi</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cập nhật mới nhất từ ROWENA — khuyến mãi, kiến thức xăm và nhiều hơn nữa
          </p>
        </motion.div>

        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                active === c
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border border-border/50 bg-card">
                <div className="aspect-[16/9] bg-secondary/50" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 rounded bg-secondary/50" />
                  <div className="h-5 w-3/4 rounded bg-secondary/50" />
                  <div className="h-3 w-full rounded bg-secondary/50" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-card p-12 text-center">
            <p className="text-muted-foreground">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="group block overflow-hidden rounded-lg border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  {post.cover_image ? (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary/20">R</span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                        {post.category}
                      </span>
                      {post.published_at && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar size={11} />
                          {format(new Date(post.published_at), "dd MMM yyyy", { locale: vi })}
                        </span>
                      )}
                    </div>
                    <h3 className="font-sans text-base font-semibold text-foreground line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary transition-all group-hover:gap-2">
                      Đọc thêm <ArrowRight size={12} />
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
