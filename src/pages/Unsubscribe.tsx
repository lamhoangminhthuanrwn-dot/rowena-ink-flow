import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Status = "loading" | "valid" | "already_unsubscribed" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already_unsubscribed");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already_unsubscribed");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          {status === "success" ? "Đã hủy đăng ký" : "Hủy đăng ký email"}
        </h1>

        {status === "loading" && (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {status === "valid" && (
          <>
            <p className="text-muted-foreground">
              Bạn có chắc muốn hủy nhận email thông báo từ ROWENA Tattoo không?
            </p>
            <button
              onClick={handleUnsubscribe}
              className="inline-flex items-center justify-center rounded-none bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Xác nhận hủy đăng ký
            </button>
          </>
        )}

        {status === "success" && (
          <p className="text-muted-foreground">
            Bạn đã hủy đăng ký thành công. Bạn sẽ không nhận được email thông báo nữa.
          </p>
        )}

        {status === "already_unsubscribed" && (
          <p className="text-muted-foreground">
            Email này đã được hủy đăng ký trước đó.
          </p>
        )}

        {status === "invalid" && (
          <p className="text-destructive">
            Link hủy đăng ký không hợp lệ hoặc đã hết hạn.
          </p>
        )}

        {status === "error" && (
          <p className="text-destructive">
            Có lỗi xảy ra. Vui lòng thử lại sau.
          </p>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
