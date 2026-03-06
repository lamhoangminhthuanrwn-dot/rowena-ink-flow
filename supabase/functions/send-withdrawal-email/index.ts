import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "lamhoangminhthuan@gmail.com";

function sanitize(str: string): string {
  return (str || "").replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c] || c)
  ).slice(0, 500);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { amount_vnd, momo_phone, momo_name } = body;

    if (!amount_vnd || !momo_phone) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formattedAmount = new Intl.NumberFormat("vi-VN").format(amount_vnd) + "đ";
    const now = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Rowena Tattoo <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `[Rowena] Yêu cầu rút tiền mới: ${formattedAmount}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;">
            <h2 style="margin:0 0 16px;color:#1a1a1a;">💸 Yêu cầu rút tiền mới</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#6b7280;">Số tiền</td><td style="padding:8px 0;font-weight:600;color:#1a1a1a;">${sanitize(formattedAmount)}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">SĐT MoMo</td><td style="padding:8px 0;font-weight:600;color:#1a1a1a;">${sanitize(momo_phone)}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Tên MoMo</td><td style="padding:8px 0;color:#1a1a1a;">${sanitize(momo_name || "Không có")}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;">Thời gian</td><td style="padding:8px 0;color:#1a1a1a;">${sanitize(now)}</td></tr>
            </table>
            <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">Vui lòng vào trang quản lý để duyệt yêu cầu này.</p>
          </div>
        `,
      }),
    });

    const emailResult = await emailRes.text();

    if (!emailRes.ok) {
      console.error("Resend error:", emailResult);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
