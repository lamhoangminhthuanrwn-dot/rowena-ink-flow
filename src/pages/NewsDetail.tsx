import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Share2, Check } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { setSEO, resetSEO, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { toast } from "sonner";
import { formatContent } from "@/lib/formatContent";

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const shareUrl = `https://${projectId}.supabase.co/functions/v1/og-meta?slug=${slug}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Đã sao chép link chia sẻ!");
    setTimeout(() => setCopied(false), 2000);
  };

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug!)
        .eq("is_published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (post) {
      setSEO({
        title: post.title,
        description: post.excerpt || undefined,
        image: post.cover_image || undefined,
        type: "article",
        url: window.location.href,
        jsonLd: buildArticleJsonLd(post),
      });
    }
    return () => resetSEO();
  }, [post]);

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 animate-pulse space-y-6">
          <div className="h-4 w-32 rounded bg-secondary/50" />
          <div className="h-8 w-3/4 rounded bg-secondary/50" />
          <div className="h-64 rounded-lg bg-secondary/50" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-secondary/50" />
            <div className="h-4 w-5/6 rounded bg-secondary/50" />
            <div className="h-4 w-4/6 rounded bg-secondary/50" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="font-sans text-2xl font-bold text-foreground">Bài viết không tồn tại</h1>
          <Link to="/tin-tuc" className="mt-4 inline-block text-sm text-primary hover:underline">
            ← Quay lại tin tức
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <article className="mx-auto max-w-3xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link
            to="/tin-tuc"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} /> Tin tức
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {post.category}
            </span>
            {post.published_at && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={12} />
                {format(new Date(post.published_at), "dd MMMM yyyy", { locale: vi })}
              </span>
            )}
            <button
              onClick={handleShare}
              className="ml-auto flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              title="Sao chép link chia sẻ"
            >
              {copied ? <Check size={12} /> : <Share2 size={12} />}
              {copied ? "Đã sao chép" : "Chia sẻ"}
            </button>
          </div>

          <h1 className="font-sans text-3xl font-bold text-foreground leading-tight md:text-4xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
          )}
        </motion.div>

        {post.cover_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full rounded-lg object-cover"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="prose-custom mt-10"
          dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
        />
      </article>
    </div>
  );
};

export default NewsDetail;
