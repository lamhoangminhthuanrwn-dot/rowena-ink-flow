import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function sanitize(str: string): string {
  return (str || "")
    .replace(/[<>&"']/g, (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c] || c)
    )
    .slice(0, 500);
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
    const { booking_code, customer_name, customer_email, old_price, new_price } = body;

    if (!customer_email || !booking_code) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
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

    const formatVND = (v: number) => new Intl.NumberFormat("vi-VN").format(v) + "đ";
    const safeCode = sanitize(booking_code);
    const safeName = sanitize(customer_name || "Quý khách");
    const oldFormatted = old_price != null ? formatVND(old_price) : "Chưa có";
    const newFormatted = formatVND(new_price);

    const html = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="margin:0 0 8px;color:#1a1a1a;">Cập nhật giá đơn hàng</h2>
        <p style="color:#6b7280;margin:0 0 16px;">Xin chào <strong>${safeName}</strong>,</p>
        <p style="color:#374151;margin:0 0 16px;">Giá đơn hàng <strong>${safeCode}</strong> của bạn đã được cập nhật:</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <tr>
            <td style="padding:10px 12px;background:#f9fafb;border:1px solid #e5e7eb;color:#6b7280;">Giá cũ</td>
            <td style="padding:10px 12px;background:#f9fafb;border:1px solid #e5e7eb;text-decoration:line-through;color:#9ca3af;">${sanitize(oldFormatted)}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;color:#6b7280;">Giá mới</td>
            <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:700;color:#d4a843;">${sanitize(newFormatted)}</td>
          </tr>
        </table>
        <p style="color:#6b7280;font-size:14px;margin:0;">Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi.</p>
        <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">— ROWENA Tattoo Studio</p>
      </div>
    `;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ROWENA Tattoo <onboarding@resend.dev>",
        to: [customer_email],
        subject: `[ROWENA] Cập nhật giá đơn hàng ${safeCode}`,
        html,
      }),
    });

    const result = await emailRes.text();
    console.log("Resend response:", emailRes.status, result);

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
