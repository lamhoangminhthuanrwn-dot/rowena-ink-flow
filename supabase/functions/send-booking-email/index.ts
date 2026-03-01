import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require a valid Authorization Bearer token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const {
      booking_code, customer_name, phone, email, design_name,
      placement, size, style, appointment_date, appointment_time,
      note, reference_urls,
    } = await req.json();

    // Validate booking_code exists in DB
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .select('id')
      .eq('booking_code', booking_code)
      .single();

    if (bookingErr || !booking) {
      return new Response(JSON.stringify({ error: 'Invalid booking code' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    function escapeHtml(text: string): string {
      const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
      return text.replace(/[&<>"']/g, m => map[m]);
    }

    function sanitizeUrl(url: string): string {
      try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) return '#';
        return escapeHtml(parsed.href);
      } catch { return '#'; }
    }

    const safeBookingCode = escapeHtml(booking_code || '');
    const safeCustomerName = escapeHtml(customer_name || '');
    const safePhone = escapeHtml(phone || '');
    const safeEmail = escapeHtml(email || 'N/A');
    const safeDesignName = escapeHtml(design_name || '');
    const safePlacement = escapeHtml(placement || 'N/A');
    const safeSize = escapeHtml(size || 'N/A');
    const safeStyle = escapeHtml(style || 'N/A');
    const safeAppointmentDate = escapeHtml(appointment_date || '');
    const safeAppointmentTime = escapeHtml(appointment_time || '');
    const safeNote = escapeHtml(note || 'Không có');

    const referenceImagesHtml = reference_urls && reference_urls.length > 0
      ? `<p><strong>Ảnh tham khảo:</strong></p>${reference_urls.map((url: string) => { const safe = sanitizeUrl(url); return `<p><a href="${safe}">${safe}</a></p>`; }).join('')}`
      : '';

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d4a843;">🔔 Booking mới — ${safeBookingCode}</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Mã booking</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${safeBookingCode}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Khách hàng</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeCustomerName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">SĐT</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safePhone}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeEmail}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Mẫu</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeDesignName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Vị trí</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safePlacement}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Kích thước</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeSize}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Phong cách</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeStyle}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Ngày hẹn</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeAppointmentDate} · ${safeAppointmentTime}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Ghi chú</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safeNote}</td></tr>
        </table>
        ${referenceImagesHtml}
        <p style="margin-top: 20px; color: #888; font-size: 12px;">— ROWENA Tattoo Studio</p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ROWENA Tattoo <onboarding@resend.dev>',
        to: ['lamhoangminhthuan@gmail.com'],
        subject: `[ROWENA] New Booking ${booking_code}`,
        html: htmlBody,
      }),
    });

    const result = await res.text();
    console.log('Resend response:', res.status, result);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
