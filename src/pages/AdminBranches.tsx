import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Plus, Pencil, Trash2, Check, X, MapPin, User, Clock,
  ChevronDown, ChevronUp, ArrowLeft,
} from "lucide-react";

interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string | null;
}

interface Artist {
  id: string;
  branch_id: string;
  name: string;
  work_start: string;
  work_end: string;
  is_active: boolean;
}

const AdminBranches = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);

  // Branch form
  const [branchForm, setBranchForm] = useState({ name: "", slug: "", address: "" });
  const [editingBranch, setEditingBranch] = useState<string | null>(null);
  const [showBranchForm, setShowBranchForm] = useState(false);

  // Artist form
  const [artistForm, setArtistForm] = useState({ name: "", work_start: "08:00", work_end: "18:00" });
  const [editingArtist, setEditingArtist] = useState<string | null>(null);
  const [addingArtistBranch, setAddingArtistBranch] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/auth");
      toast.error("Bạn không có quyền truy cập trang này.");
    }
  }, [user, authLoading, isAdmin, navigate]);

  const fetchAll = async () => {
    const [{ data: b }, { data: a }] = await Promise.all([
      supabase.from("branches").select("*").order("name"),
      supabase.from("artists").select("*").order("name"),
    ]);
    if (b) setBranches(b);
    if (a) setArtists(a);
  };

  useEffect(() => {
    if (user && isAdmin) fetchAll();
  }, [user, authLoading, isAdmin]);

  // ─── Branch CRUD ───
  const saveBranch = async () => {
    if (!branchForm.name.trim()) return toast.error("Tên chi nhánh không được trống");
    const slug = branchForm.slug.trim() || branchForm.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    if (editingBranch) {
      const { error } = await supabase.from("branches").update({
        name: branchForm.name, slug, address: branchForm.address || null,
      }).eq("id", editingBranch);
      if (error) return toast.error("Lỗi: " + error.message);
      toast.success("Đã cập nhật chi nhánh");
    } else {
      const { error } = await supabase.from("branches").insert({
        name: branchForm.name, slug, address: branchForm.address || null,
      });
      if (error) return toast.error("Lỗi: " + error.message);
      toast.success("Đã thêm chi nhánh");
    }
    resetBranchForm();
    fetchAll();
  };

  const deleteBranch = async (id: string) => {
    const branchArtists = artists.filter((a) => a.branch_id === id);
    if (branchArtists.length > 0) return toast.error("Không thể xóa chi nhánh còn thợ xăm");
    const { error } = await supabase.from("branches").delete().eq("id", id);
    if (error) return toast.error("Lỗi: " + error.message);
    toast.success("Đã xóa chi nhánh");
    fetchAll();
  };

  const startEditBranch = (b: Branch) => {
    setEditingBranch(b.id);
    setBranchForm({ name: b.name, slug: b.slug, address: b.address || "" });
    setShowBranchForm(true);
  };

  const resetBranchForm = () => {
    setEditingBranch(null);
    setBranchForm({ name: "", slug: "", address: "" });
    setShowBranchForm(false);
  };

  // ─── Artist CRUD ───
  const saveArtist = async (branchId: string) => {
    if (!artistForm.name.trim()) return toast.error("Tên thợ không được trống");

    if (editingArtist) {
      const { error } = await supabase.from("artists").update({
        name: artistForm.name, work_start: artistForm.work_start, work_end: artistForm.work_end,
      }).eq("id", editingArtist);
      if (error) return toast.error("Lỗi: " + error.message);
      toast.success("Đã cập nhật thợ xăm");
    } else {
      const { error } = await supabase.from("artists").insert({
        branch_id: branchId, name: artistForm.name,
        work_start: artistForm.work_start, work_end: artistForm.work_end,
      });
      if (error) return toast.error("Lỗi: " + error.message);
      toast.success("Đã thêm thợ xăm");
    }
    resetArtistForm();
    fetchAll();
  };

  const toggleArtistActive = async (artist: Artist) => {
    const { error } = await supabase.from("artists").update({ is_active: !artist.is_active }).eq("id", artist.id);
    if (error) return toast.error("Lỗi: " + error.message);
    toast.success(artist.is_active ? "Đã tắt hoạt động" : "Đã bật hoạt động");
    fetchAll();
  };

  const deleteArtist = async (id: string) => {
    const { error } = await supabase.from("artists").delete().eq("id", id);
    if (error) return toast.error("Lỗi: " + error.message);
    toast.success("Đã xóa thợ xăm");
    fetchAll();
  };

  const startEditArtist = (a: Artist) => {
    setEditingArtist(a.id);
    setArtistForm({ name: a.name, work_start: a.work_start, work_end: a.work_end });
    setAddingArtistBranch(a.branch_id);
  };

  const resetArtistForm = () => {
    setEditingArtist(null);
    setArtistForm({ name: "", work_start: "08:00", work_end: "18:00" });
    setAddingArtistBranch(null);
  };

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center pt-16"><p className="text-muted-foreground">Đang tải...</p></div>;
  }

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <Button variant="ghost" size="sm" onClick={() => navigate("/ketoan")} className="gap-1 text-muted-foreground">
              <ArrowLeft size={16} /> Kế toán
            </Button>
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Quản lý chi nhánh & thợ xăm</h1>
          <p className="mt-2 text-sm text-muted-foreground">Thêm, sửa, xóa chi nhánh và thợ xăm</p>
        </motion.div>

        {/* Add Branch */}
        <div className="mt-6 mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
            <MapPin size={18} className="text-primary" /> Chi nhánh ({branches.length})
          </h2>
          {!showBranchForm && (
            <Button size="sm" onClick={() => setShowBranchForm(true)} className="gap-1">
              <Plus size={14} /> Thêm chi nhánh
            </Button>
          )}
        </div>

        {showBranchForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Tên chi nhánh *</label>
                <input type="text" value={branchForm.name} onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="Rowena Đà Nẵng" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Slug</label>
                <input type="text" value={branchForm.slug} onChange={(e) => setBranchForm({ ...branchForm, slug: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="da-nang" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Địa chỉ</label>
                <input type="text" value={branchForm.address} onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="123 Nguyễn Văn Linh" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={saveBranch} className="gap-1"><Check size={14} /> {editingBranch ? "Cập nhật" : "Thêm"}</Button>
              <Button size="sm" variant="ghost" onClick={resetBranchForm} className="gap-1"><X size={14} /> Hủy</Button>
            </div>
          </motion.div>
        )}

        {/* Branch list */}
        <div className="space-y-3">
          {branches.map((b) => {
            const branchArtists = artists.filter((a) => a.branch_id === b.id);
            const isExpanded = expandedBranch === b.id;
            return (
              <div key={b.id} className="rounded-lg border border-border/50 bg-card overflow-hidden">
                {/* Branch header */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => setExpandedBranch(isExpanded ? null : b.id)}
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{b.name}</p>
                      {b.address && <p className="text-xs text-muted-foreground">{b.address}</p>}
                    </div>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      {branchArtists.length} thợ
                    </span>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => startEditBranch(b)} title="Sửa">
                      <Pencil size={13} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => deleteBranch(b.id)} title="Xóa">
                      <Trash2 size={13} />
                    </Button>
                    {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </div>
                </div>

                {/* Artists list */}
                {isExpanded && (
                  <div className="border-t border-border/50 px-4 py-3 bg-secondary/10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <User size={13} /> Danh sách thợ xăm
                      </h3>
                      {addingArtistBranch !== b.id && (
                        <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => { resetArtistForm(); setAddingArtistBranch(b.id); }}>
                          <Plus size={12} /> Thêm thợ
                        </Button>
                      )}
                    </div>

                    {/* Add/Edit artist form */}
                    {addingArtistBranch === b.id && (
                      <div className="mb-3 rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
                        <div className="grid gap-2 sm:grid-cols-3">
                          <div>
                            <label className="mb-0.5 block text-xs text-muted-foreground">Tên *</label>
                            <input type="text" value={artistForm.name} onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })}
                              className="w-full rounded border border-border bg-secondary/30 px-2 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                              placeholder="Nguyễn Văn A" />
                          </div>
                          <div>
                            <label className="mb-0.5 block text-xs text-muted-foreground">Giờ bắt đầu</label>
                            <input type="time" value={artistForm.work_start} onChange={(e) => setArtistForm({ ...artistForm, work_start: e.target.value })}
                              className="w-full rounded border border-border bg-secondary/30 px-2 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none" />
                          </div>
                          <div>
                            <label className="mb-0.5 block text-xs text-muted-foreground">Giờ kết thúc</label>
                            <input type="time" value={artistForm.work_end} onChange={(e) => setArtistForm({ ...artistForm, work_end: e.target.value })}
                              className="w-full rounded border border-border bg-secondary/30 px-2 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="h-7 gap-1 text-xs" onClick={() => saveArtist(b.id)}>
                            <Check size={12} /> {editingArtist ? "Cập nhật" : "Thêm"}
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={resetArtistForm}>
                            <X size={12} /> Hủy
                          </Button>
                        </div>
                      </div>
                    )}

                    {branchArtists.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">Chưa có thợ xăm nào</p>
                    ) : (
                      <div className="space-y-1">
                        {branchArtists.map((a) => (
                          <div key={a.id} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${a.is_active ? "bg-card" : "bg-muted/30 opacity-60"}`}>
                            <div className="flex items-center gap-3">
                              <User size={14} className={a.is_active ? "text-primary" : "text-muted-foreground"} />
                              <span className="font-medium text-foreground">{a.name}</span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock size={11} /> {a.work_start}–{a.work_end}
                              </span>
                              {!a.is_active && <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">Nghỉ</span>}
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleArtistActive(a)} title={a.is_active ? "Tắt hoạt động" : "Bật hoạt động"}>
                                {a.is_active ? <X size={12} className="text-muted-foreground" /> : <Check size={12} className="text-primary" />}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => startEditArtist(a)} title="Sửa">
                                <Pencil size={12} />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => deleteArtist(a.id)} title="Xóa">
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminBranches;
