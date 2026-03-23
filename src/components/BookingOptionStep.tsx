import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { TattooDesign, TattooVariant } from "@/data/tattooDesigns";
import { Info } from "lucide-react";
import { formatVNDShort, getPositions, getStyles, findVariant } from "@/data/tattooDesigns";

export interface SelectedOptions {
  position: string;
  style: string;
  scheduleType: "simple" | "sameday";
  paymentType: "full" | "perSession";
  variant: TattooVariant;
  finalPrice: number;
  sessionsLabel: string;
}

interface Props {
  design: TattooDesign;
  onOptionsChange: (options: SelectedOptions | null) => void;
}

const OptionGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const OptionButton = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`border px-4 py-2.5 font-mono text-sm font-bold transition-all ${
      selected
        ? "border-primary bg-primary/10 text-primary"
        : "border-border bg-card text-foreground hover:border-primary/50"
    }`}
  >
    {children}
  </button>
);

const BookingOptionStep = ({ design, onOptionsChange }: Props) => {
  const variants = design.variants || [];
  const isMini = !!design.isMiniType;

  const positions = getPositions(variants);

  const [position, setPosition] = useState("");
  const [style, setStyle] = useState("");
  const [scheduleType, setScheduleType] = useState<"simple" | "sameday" | "">("");
  const [paymentType, setPaymentType] = useState<"full" | "perSession" | "">("");
  const [selectedScheduleIdx, setSelectedScheduleIdx] = useState<number | null>(null);

  const availableStyles = position ? getStyles(variants, position) : [];

  const selectedVariant =
    position && (isMini ? style : style || (!availableStyles.length ? "" : ""))
      ? findVariant(variants, position, style || undefined)
      : undefined;

  const hasScheduleOptions = !!(selectedVariant?.scheduleOptions && selectedVariant.scheduleOptions.length > 0);
  const hasSameDay = selectedVariant?.priceSameDay != null && selectedVariant.priceSameDay > 0;

  useEffect(() => {
    setStyle("");
    setScheduleType("");
    setPaymentType("");
    setSelectedScheduleIdx(null);
  }, [position]);
  useEffect(() => {
    setScheduleType("");
    setPaymentType("");
    setSelectedScheduleIdx(null);
  }, [style]);
  useEffect(() => {
    if (isMini || hasScheduleOptions) {
      setPaymentType("full");
    } else {
      setPaymentType("");
    }
  }, [scheduleType, isMini, hasScheduleOptions]);

  useEffect(() => {
    if (selectedVariant?.scheduleOptions?.length === 1) {
      setSelectedScheduleIdx(0);
    }
  }, [selectedVariant]);

  useEffect(() => {
    if (selectedScheduleIdx !== null && hasScheduleOptions) {
      setScheduleType("simple");
      setPaymentType("full");
    }
  }, [selectedScheduleIdx, hasScheduleOptions]);

  useEffect(() => {
    if (hasScheduleOptions) {
      if (selectedScheduleIdx === null || !selectedVariant) {
        onOptionsChange(null);
        return;
      }
      const opt = selectedVariant.scheduleOptions![selectedScheduleIdx];
      onOptionsChange({
        position,
        style: style || position,
        scheduleType: "simple",
        paymentType: "full",
        variant: selectedVariant,
        finalPrice: opt.price,
        sessionsLabel: opt.label,
      });
      return;
    }

    if (!selectedVariant || !scheduleType || !paymentType) {
      onOptionsChange(null);
      return;
    }

    let price: number;
    let sessionsLabel: string;

    if (scheduleType === "sameday") {
      price = selectedVariant.priceSameDay || selectedVariant.priceSimple;
      sessionsLabel = "Xong trong ngày";
    } else {
      price = selectedVariant.priceSimple;
      sessionsLabel = selectedVariant.sessions;
    }

    let finalPrice = price;
    if (paymentType === "perSession" && scheduleType === "simple") {
      const match = selectedVariant.sessions.match(/(\d+)/);
      const count = match ? parseInt(match[1]) : 1;
      if (count > 1) {
        finalPrice = Math.round(price / count);
      }
    }

    onOptionsChange({
      position,
      style: style || position,
      scheduleType,
      paymentType,
      variant: selectedVariant,
      finalPrice,
      sessionsLabel,
    });
  }, [selectedVariant, scheduleType, paymentType, selectedScheduleIdx]);

  const displayFinalPrice = (() => {
    if (hasScheduleOptions && selectedScheduleIdx !== null && selectedVariant) {
      const opt = selectedVariant.scheduleOptions![selectedScheduleIdx];
      if (opt.isPerSession) {
        const match = opt.sessions?.match(/(\d+)/);
        const count = match ? parseInt(match[1]) : 1;
        return { perSession: 3500000, total: opt.price, sessions: count, note: opt.note };
      }
      return { total: opt.price, note: opt.note, sessions: opt.sessions };
    }
    if (!selectedVariant || !scheduleType) return null;
    const price =
      scheduleType === "sameday"
        ? selectedVariant.priceSameDay || selectedVariant.priceSimple
        : selectedVariant.priceSimple;

    if (paymentType === "perSession" && scheduleType === "simple") {
      const match = selectedVariant.sessions.match(/(\d+)/);
      const count = match ? parseInt(match[1]) : 1;
      if (count > 1) {
        return { perSession: Math.round(price / count), total: price, sessions: count };
      }
    }
    return { total: price };
  })();

  const showPrice = hasScheduleOptions ? selectedScheduleIdx !== null : !!paymentType;

  return (
    <div className="space-y-5">
      <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-foreground">Chọn tùy chọn</h2>

      <OptionGroup label="Vị trí">
        {positions.map((p) => (
          <OptionButton key={p} selected={position === p} onClick={() => setPosition(p)}>
            {p}
          </OptionButton>
        ))}
      </OptionGroup>

      {position && availableStyles.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <OptionGroup label={isMini ? "Kích thước" : "Thể loại"}>
            {availableStyles.map((s) => (
              <OptionButton key={s} selected={style === s} onClick={() => setStyle(s)}>
                {s}
              </OptionButton>
            ))}
          </OptionGroup>
        </motion.div>
      )}

      {selectedVariant && hasScheduleOptions && selectedVariant.scheduleOptions!.length > 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <OptionGroup label="Tiến độ">
            {selectedVariant.scheduleOptions!.map((opt, idx) => (
              <OptionButton key={idx} selected={selectedScheduleIdx === idx} onClick={() => setSelectedScheduleIdx(idx)}>
                {opt.label}
              </OptionButton>
            ))}
          </OptionGroup>
        </motion.div>
      )}

      {selectedVariant && !hasScheduleOptions && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <OptionGroup label="Tiến độ">
            <OptionButton selected={scheduleType === "simple"} onClick={() => setScheduleType("simple")}>
              {selectedVariant.sessions}
            </OptionButton>
            {hasSameDay && (
              <OptionButton selected={scheduleType === "sameday"} onClick={() => setScheduleType("sameday")}>
                Xong trong ngày
              </OptionButton>
            )}
          </OptionGroup>
        </motion.div>
      )}

      {scheduleType && !isMini && !hasScheduleOptions && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <OptionGroup label="Thanh toán">
            <OptionButton selected={paymentType === "full"} onClick={() => setPaymentType("full")}>
              Trả hết
            </OptionButton>
            {scheduleType === "simple" &&
              (() => {
                const match = selectedVariant?.sessions.match(/(\d+)/);
                const count = match ? parseInt(match[1]) : 1;
                return count > 1;
              })() && (
                <OptionButton selected={paymentType === "perSession"} onClick={() => setPaymentType("perSession")}>
                  Trả theo buổi
                </OptionButton>
              )}
          </OptionGroup>
        </motion.div>
      )}

      {displayFinalPrice && showPrice && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-primary/30 bg-primary/5 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Giá ước tính</p>
          {"perSession" in displayFinalPrice && displayFinalPrice.perSession ? (
            <p className="text-2xl font-bold text-primary">
              {formatVNDShort(displayFinalPrice.perSession)}
              <span className="text-base font-normal text-muted-foreground"> / buổi</span>
            </p>
          ) : (
            <>
              <p className="text-2xl font-bold text-primary">{formatVNDShort(displayFinalPrice.total)}</p>
              {typeof displayFinalPrice.sessions === "string" && (
                <p className="mt-1 font-mono text-xs text-muted-foreground">{displayFinalPrice.sessions} thực hiện</p>
              )}
            </>
          )}
          {"note" in displayFinalPrice && displayFinalPrice.note && (
            <p className="mt-2 font-mono text-xs font-bold text-primary">{displayFinalPrice.note}</p>
          )}
          {selectedVariant && selectedVariant.priceDifficult > 0 && !hasScheduleOptions && (
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              Hình khó: {formatVNDShort(selectedVariant.priceDifficult)}
              {selectedVariant.priceDifficultSessions ? ` / ${selectedVariant.priceDifficultSessions}` : ""}
            </p>
          )}
        </motion.div>
      )}

      {selectedVariant && (
        <div className="flex items-start gap-2 border border-border bg-secondary px-3 py-2">
          <Info size={14} className="mt-0.5 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground">Số buổi thực hiện phụ thuộc vào độ chịu đau của khách hàng (ủ tê chỉ giảm 1 phần sát thương 50-80%)</p>
        </div>
      )}
    </div>
  );
};

export default BookingOptionStep;
