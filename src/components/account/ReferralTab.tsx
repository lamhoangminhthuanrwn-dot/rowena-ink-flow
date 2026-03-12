import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getReferralUrl } from "@/lib/constants";

interface ReferralTabProps {
  referralCode: string | null | undefined;
}

const ReferralTab = ({ referralCode }: ReferralTabProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReferral = () => {
    if (!referralCode) return;
    const link = getReferralUrl(referralCode);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Đã sao chép link giới thiệu!");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
        <Share2 className="mx-auto mb-3 text-primary" size={32} />
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
          Giới thiệu bạn bè — Nhận 10% hoa hồng
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Chia sẻ link giới thiệu. Khi bạn bè đặt lịch và cọc thành công lần đầu, bạn nhận{" "}
          <span className="font-semibold text-primary">10% giá trị đơn đặt</span> vào ví.
        </p>

        {referralCode ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Mã giới thiệu</p>
              <p className="font-mono text-lg font-bold text-primary">{referralCode}</p>
            </div>
            <div className="rounded-lg border border-border bg-card px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Link giới thiệu</p>
              <p className="break-all text-sm text-foreground">{getReferralUrl(referralCode)}</p>
            </div>
            <Button onClick={handleCopyReferral} className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Đã sao chép!" : "Sao chép link giới thiệu"}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Mã giới thiệu sẽ hiển thị sau khi tài khoản được kích hoạt.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReferralTab;
