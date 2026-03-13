import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "lamhoangminhthuan@gmail.com";
const PRIMARY_FROM = "ROWENA Tattoo <no-reply@notify.thuanlam.id.vn>";
const FALLBACK_FROM = "ROWENA Tattoo <onboarding@resend.dev>";

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
    const { booking_code, customer_name, old_price, new_price } = body;

    if (!booking_code || new_price === undefined) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ success: true, email_sent: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fmt = (v: number | null | undefined) =>
      v != null ? new Intl.NumberFormat("vi-VN").format(v) + "đ" : "Chưa có";
    const now = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

    const htmlBody = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="margin:0 0 16px;color:#1a1a1a;">💰 Giá đơn hàng đã thay đổi</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#6b7280;">Mã booking</td><td style="padding:8px 0;font-weight:600;color:#1a1a1a;">${sanitize(booking_code)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Khách hàng</td><td style="padding:8px 0;color:#1a1a1a;">${sanitize(customer_name || "N/A")}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Giá cũ</td><td style="padding:8px 0;color:#1a1a1a;">${sanitize(fmt(old_price))}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Giá mới</td><td style="padding:8px 0;font-weight:600;color:#d4a843;">${sanitize(fmt(new_price))}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Thời gian</td><td style="padding:8px 0;color:#1a1a1a;">${sanitize(now)}</td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">— ROWENA Tattoo Studio</p>
      </div>
    `;

    const sendEmail = (from: string) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [ADMIN_EMAIL],
          subject: `[Rowena] Cập nhật giá: ${sanitize(booking_code)}`,
          html: htmlBody,
        }),
      });

    const emailRes = await sendEmail(PRIMARY_FROM);
    if (emailRes.ok) {
      await emailRes.text();
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.warn("Primary Resend error:", await emailRes.text());

    const fallbackRes = await sendEmail(FALLBACK_FROM);
    if (fallbackRes.ok) {
      await fallbackRes.text();
      console.warn("Sent price update email with fallback sender.");
      return new Response(JSON.stringify({ success: true, fallback_sender: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.warn("Fallback Resend error:", await fallbackRes.text());

    return new Response(JSON.stringify({ success: true, email_sent: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ success: true, email_sent: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
