import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Eye, EyeOff, ArrowLeft, Save, X, Upload, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatContent } from "@/lib/formatContent";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  is_published: boolean;
}

const emptyForm: PostForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: "Tin tức",
  is_published: false,
};

const categories = ["Tin tức", "Khuyến mãi", "Kiến thức xăm", "Aftercare"];

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const AdminPosts = () => {
  const navigate = useNavigate();
  const { user, canManagePosts, isAdmin, loading } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [contentUploading, setContentUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentImageRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ hỗ trợ file hình ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File không được vượt quá 5MB");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("post-images")
        .upload(fileName, file, { contentType: file.type });
      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(fileName);

      setForm((prev) => ({ ...prev, cover_image: urlData.publicUrl }));
      toast.success("Đã tải ảnh lên!");
    } catch (err: any) {
      toast.error(err.message || "Lỗi tải ảnh");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ hỗ trợ file hình ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File không được vượt quá 5MB");
      return;
    }

    setContentUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("post-images")
        .upload(fileName, file, { contentType: file.type });
      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(fileName);

      const textarea = contentTextareaRef.current;
      const imageMarkdown = `\n![image](${urlData.publicUrl})\n`;

      if (textarea) {
        const start = textarea.selectionStart ?? form.content.length;
        const before = form.content.slice(0, start);
        const after = form.content.slice(start);
        setForm((prev) => ({ ...prev, content: before + imageMarkdown + after }));
        // Restore cursor after React re-render
        setTimeout(() => {
          const newPos = start + imageMarkdown.length;
          textarea.selectionStart = newPos;
          textarea.selectionEnd = newPos;
          textarea.focus();
        }, 0);
      } else {
        setForm((prev) => ({ ...prev, content: prev.content + imageMarkdown }));
      }

      toast.success("Đã chèn ảnh vào nội dung!");
    } catch (err: any) {
      toast.error(err.message || "Lỗi tải ảnh");
    } finally {
      setContentUploading(false);
      if (contentImageRef.current) contentImageRef.current.value = "";
    }
  };

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: canManagePosts,
  });

  const saveMutation = useMutation({
    mutationFn: async (isNew: boolean) => {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || toSlug(form.title),
        excerpt: form.excerpt.trim() || null,
        content: form.content,
        cover_image: form.cover_image.trim() || null,
        category: form.category,
        is_published: form.is_published,
        published_at: form.is_published ? new Date().toISOString() : null,
        author_id: user?.id,
      };
      if (isNew) {
        const { error } = await supabase.from("posts").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").update(payload).eq("id", editing!);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Đã lưu bài viết!");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setEditing(null);
      setForm(emptyForm);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Đã xóa bài viết");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from("posts")
        .update({
          is_published: !published,
          published_at: !published ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (loading) return null;
  if (!canManagePosts) {
    navigate("/");
    return null;
  }

  const startEdit = (post: any) => {
    setEditing(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      cover_image: post.cover_image || "",
      category: post.category,
      is_published: post.is_published,
    });
  };

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(isAdmin ? "/ketoan" : "/tin-tuc")} className="gap-1">
              <ArrowLeft size={16} /> {isAdmin ? "Kế toán" : "Tin tức"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-sans text-3xl font-bold text-foreground">Quản lý bài viết</h1>
              <p className="mt-1 text-sm text-muted-foreground">{posts.length} bài viết</p>
            </div>
            {!editing && (
              <Button
                onClick={() => { setEditing("new"); setForm(emptyForm); }}
                className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus size={16} /> Viết bài mới
              </Button>
            )}
          </div>
        </motion.div>

        {/* Editor */}
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-lg border border-border bg-card p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-lg font-semibold text-foreground">
                {editing === "new" ? "Bài viết mới" : "Chỉnh sửa bài viết"}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => { setEditing(null); setForm(emptyForm); }}>
                <X size={16} />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Tiêu đề *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: toSlug(e.target.value) })}
                  className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  placeholder="Tiêu đề bài viết"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Slug (URL)</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  placeholder="tieu-de-bai-viet"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Danh mục</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Ảnh bìa</label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <input
                        value={form.cover_image}
                        onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                        className="flex-1 rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        placeholder="URL ảnh hoặc upload file bên dưới"
                      />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="gap-1.5 shrink-0 h-[42px]"
                      >
                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        {uploading ? "Đang tải..." : "Upload"}
                      </Button>
                    </div>
                    {form.cover_image && (
                      <div className="relative w-full max-w-xs">
                        <img
                          src={form.cover_image}
                          alt="Preview"
                          className="w-full h-32 rounded-lg border border-border object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Tóm tắt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  placeholder="Mô tả ngắn cho SEO..."
                />
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-muted-foreground">Nội dung * (hỗ trợ markdown cơ bản)</label>
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-md border border-border overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setPreviewMode(false)}
                        className={`px-2.5 py-1 text-xs font-medium transition-colors ${!previewMode ? 'bg-primary text-primary-foreground' : 'bg-secondary/30 text-muted-foreground hover:text-foreground'}`}
                      >
                        Viết
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode(true)}
                        className={`px-2.5 py-1 text-xs font-medium transition-colors ${previewMode ? 'bg-primary text-primary-foreground' : 'bg-secondary/30 text-muted-foreground hover:text-foreground'}`}
                      >
                        Xem trước
                      </button>
                    </div>
                    <input
                      ref={contentImageRef}
                      type="file"
                      accept="image/*"
                      onChange={handleContentImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => contentImageRef.current?.click()}
                      disabled={contentUploading}
                      className="gap-1.5 h-7 text-xs"
                    >
                      {contentUploading ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
                      {contentUploading ? "Đang tải..." : "Chèn ảnh"}
                    </Button>
                  </div>
                </div>
                {previewMode ? (
                  <div
                    className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm min-h-[288px] overflow-auto prose-custom"
                    dangerouslySetInnerHTML={{ __html: form.content ? formatContent(form.content) : '<p class="text-muted-foreground italic">Chưa có nội dung để xem trước</p>' }}
                  />
                ) : (
                  <textarea
                    ref={contentTextareaRef}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    rows={12}
                    className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    placeholder="## Tiêu đề&#10;&#10;Nội dung bài viết...&#10;&#10;**In đậm**, [Link](url)"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="rounded border-border"
                />
                Xuất bản ngay
              </label>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setEditing(null); setForm(emptyForm); }}>
                  Hủy
                </Button>
                <Button
                  onClick={() => saveMutation.mutate(editing === "new")}
                  disabled={!form.title.trim() || !form.content.trim() || saveMutation.isPending}
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Save size={14} /> {saveMutation.isPending ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Posts list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border border-border/50 bg-card p-4 h-20" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-card p-12 text-center">
            <p className="text-muted-foreground">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-4 transition-colors hover:border-primary/20"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      post.is_published
                        ? "bg-success/10 text-success"
                        : "bg-muted/30 text-muted-foreground"
                    }`}>
                      {post.is_published ? "Đã xuất bản" : "Bản nháp"}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="font-sans text-sm font-semibold text-foreground truncate">{post.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {post.published_at
                      ? format(new Date(post.published_at), "dd/MM/yyyy HH:mm", { locale: vi })
                      : format(new Date(post.created_at), "dd/MM/yyyy HH:mm", { locale: vi })
                    }
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublish.mutate({ id: post.id, published: post.is_published })}
                    title={post.is_published ? "Ẩn bài" : "Xuất bản"}
                  >
                    {post.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => startEdit(post)}>
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm("Xóa bài viết này?")) deleteMutation.mutate(post.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPosts;
