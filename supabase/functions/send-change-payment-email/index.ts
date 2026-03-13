import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate token
    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    // Save token using service role
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: updateError } = await adminClient
      .from("payment_accounts")
      .update({ change_token: token, change_token_expires_at: expiresAt })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(JSON.stringify({ error: "Failed to generate token" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send email via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      return new Response(JSON.stringify({ error: "Email service is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendFrom = "ROWENA Tattoo <no-reply@notify.thuanlam.id.vn>";
    const fallbackFrom = "ROWENA Tattoo <onboarding@resend.dev>";
    const confirmUrl = `https://thuanlam.id.vn/tai-khoan?change_token=${token}`;

    const sendEmail = (from: string) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [user.email],
          subject: "Xác nhận đổi tài khoản thanh toán — ROWENA Tattoo",
          html: `
            <div style="font-family: 'DM Sans', Arial, sans-serif; padding: 32px 28px;">
              <p style="font-family: 'Crimson Pro', Georgia, serif; font-size: 20px; font-weight: bold; color: hsl(222, 47%, 11%); letter-spacing: 0.05em; margin: 0 0 24px;">
                ROWENA <span style="font-family: 'DM Sans', Arial, sans-serif; font-size: 10px; font-weight: 300; text-transform: uppercase; letter-spacing: 0.2em; color: hsl(215, 20%, 65%);">tattoo</span>
              </p>
              <h1 style="font-family: 'Crimson Pro', Georgia, serif; font-size: 22px; font-weight: bold; color: hsl(222, 47%, 11%); margin: 0 0 20px;">Xác nhận đổi tài khoản thanh toán</h1>
              <p style="font-size: 14px; color: #55575d; line-height: 1.6; margin: 0 0 20px;">
                Bạn đã yêu cầu thay đổi tài khoản thanh toán liên kết với ví ROWENA. Nhấn nút bên dưới để xác nhận:
              </p>
              <a href="${confirmUrl}" style="display: inline-block; background-color: hsl(216, 19%, 26%); color: hsl(210, 19%, 98%); font-size: 14px; font-weight: 600; border-radius: 0px; padding: 12px 24px; text-decoration: none;">
                Xác nhận đổi tài khoản
              </a>
              <p style="font-size: 12px; color: #999999; margin: 30px 0 0;">
                Link này có hiệu lực trong 30 phút. Nếu bạn không yêu cầu thay đổi này, vui lòng bỏ qua email này.
              </p>
            </div>
          `,
        }),
      });

    const emailRes = await sendEmail(resendFrom);

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error("Resend error:", errBody);

      let resendErrorMessage = "Failed to send email";
      try {
        const parsed = JSON.parse(errBody);
        if (parsed?.message) resendErrorMessage = parsed.message;
      } catch {
        // keep fallback message
      }

      const isDomainValidationError =
        emailRes.status === 403 &&
        /domain is not verified/i.test(resendErrorMessage);

      const isTestModeRecipientError =
        emailRes.status === 403 &&
        /only send testing emails to your own email address/i.test(resendErrorMessage);

      if (isDomainValidationError) {
        const fallbackRes = await sendEmail(fallbackFrom);
        if (fallbackRes.ok) {
          await fallbackRes.text();
          console.warn("Primary sender domain not verified, sent with fallback sender.");
          return new Response(JSON.stringify({ success: true, fallback_sender: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const fallbackErr = await fallbackRes.text();
        console.error("Fallback Resend error:", fallbackErr);

        let fallbackErrorMessage = "Failed to send email";
        try {
          const parsedFallback = JSON.parse(fallbackErr);
          if (parsedFallback?.message) fallbackErrorMessage = parsedFallback.message;
        } catch {
          // keep fallback message
        }

        const fallbackIsTestModeRecipientError =
          fallbackRes.status === 403 &&
          /only send testing emails to your own email address/i.test(fallbackErrorMessage);

        if (fallbackIsTestModeRecipientError) {
          return new Response(
            JSON.stringify({
              success: true,
              email_sent: false,
              confirm_url: confirmUrl,
              warning: "Email service đang ở chế độ test: đã tạo link xác nhận trực tiếp.",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }

      const friendlyError = isDomainValidationError
        ? "Email service chưa sẵn sàng: cần xác minh domain gửi email trên Resend."
        : isTestModeRecipientError
          ? "Email service đang ở chế độ test: chỉ gửi được tới email chủ tài khoản Resend. Hãy xác minh domain để gửi cho khách hàng."
          : resendErrorMessage;

      return new Response(
        JSON.stringify({ error: friendlyError }),
        {
          status: emailRes.status === 403 ? 400 : 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    await emailRes.text();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
