import { motion } from "framer-motion";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getReferralUrl } from "@/lib/constants";

interface ReferralBannerProps {
  referralCode: string | null;
  copied: string;
  onCopy: (text: string, label: string) => void;
}

const ReferralBanner = ({ referralCode, copied, onCopy }: ReferralBannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/10 p-5 mb-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Share2 className="text-primary" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-sans text-base font-semibold text-foreground break-words">
            Giới thiệu bạn mới — nhận hoa hồng 10%
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Chia sẻ link giới thiệu, khi bạn bè đặt lịch và hoàn thành, bạn nhận 10% giá trị đơn.
          </p>
          {referralCode ? (
            <div className="mt-3 flex items-center gap-2 min-w-0">
              <code className="flex-1 truncate rounded-md border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground">
                {getReferralUrl(referralCode)}
              </code>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 gap-1.5"
                onClick={() => onCopy(getReferralUrl(referralCode), "referral")}
              >
                {copied === "referral" ? <Check size={14} /> : <Copy size={14} />}
                {copied === "referral" ? "Đã sao chép" : "Sao chép"}
              </Button>
            </div>
          ) : (
            <Link
              to="/dang-nhap"
              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Đăng ký tài khoản để nhận link giới thiệu
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralBanner;
