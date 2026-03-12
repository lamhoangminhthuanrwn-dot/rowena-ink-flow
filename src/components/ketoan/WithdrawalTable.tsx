import { Button } from "@/components/ui/button";
import { formatVND } from "@/data/tattooDesigns";
import type { Withdrawal } from "@/types/database";
import { withdrawalStatusLabels } from "@/lib/statusLabels";

interface WithdrawalTableProps {
  withdrawals: Withdrawal[];
  wdFilter: string;
  onFilterChange: (filter: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onMarkPaid: (id: string) => void;
}

const WithdrawalTable = ({ withdrawals, wdFilter, onFilterChange, onApprove, onReject, onMarkPaid }: WithdrawalTableProps) => {
  const filtered = withdrawals.filter((w) => wdFilter === "all" || w.status === wdFilter);

  return (
    <>
      <div className="flex gap-1.5 mb-4">
        {[
          { key: "all", label: "Tất cả" },
          { key: "pending", label: "Chờ duyệt" },
          { key: "approved", label: "Đã duyệt" },
          { key: "paid", label: "Đã chuyển" },
          { key: "rejected", label: "Từ chối" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${wdFilter === f.key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3">Số tiền</th>
              <th className="px-3 py-3">MoMo</th>
              <th className="px-3 py-3">Trạng thái</th>
              <th className="px-3 py-3">Ngày</th>
              <th className="px-3 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => {
              const ws = withdrawalStatusLabels[w.status] || withdrawalStatusLabels.pending;
              return (
                <tr key={w.id} className="border-b border-border/50 transition-colors hover:bg-secondary/20">
                  <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                    {w.user_id?.slice(0, 8)}...
                  </td>
                  <td className="px-3 py-3 font-semibold text-foreground">{formatVND(w.amount_vnd)}</td>
                  <td className="px-3 py-3">
                    <p className="text-foreground">{w.momo_phone}</p>
                    {w.momo_name && <p className="text-xs text-muted-foreground">{w.momo_name}</p>}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ws.className}`}>
                      {ws.text}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(w.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      {w.status === "pending" && (
                        <>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-primary" onClick={() => onApprove(w.id)}>
                            Duyệt
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-destructive" onClick={() => onReject(w.id)}>
                            Từ chối
                          </Button>
                        </>
                      )}
                      {w.status === "approved" && (
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-success" onClick={() => onMarkPaid(w.id)}>
                          Đã chuyển
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  Không có yêu cầu rút tiền nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WithdrawalTable;
