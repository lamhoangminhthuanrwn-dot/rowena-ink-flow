import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MAX_FIELD = 500;
const PHONE_REGEX = /^0\d{9,10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStr(val: unknown, max = MAX_FIELD): string {
  if (val === null || val === undefined) return '';
  if (typeof val !== 'string') return '';
  return val.slice(0, max);
}

function validateUuid(val: unknown): string | null {
  if (typeof val !== 'string') return null;
  const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return re.test(val) ? val : null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Extract user_id from auth token if present (optional auth)
    let userId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const anonClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user }, error: userError } = await anonClient.auth.getUser();
      if (!userError && user?.id) {
        userId = user.id;
      }
    }

    const body = await req.json();

    // Validate required fields
    const customer_name = validateStr(body.customer_name, 200);
    const customer_phone = validateStr(body.phone, 20);
    const fieldErrors: Record<string, string> = {};
    if (!customer_name) fieldErrors.name = 'Vui lòng nhập họ tên';
    if (!customer_phone) fieldErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!PHONE_REGEX.test(customer_phone)) fieldErrors.phone = 'Số điện thoại không hợp lệ';

    const rawEmail = validateStr(body.email, 255);
    if (rawEmail && !EMAIL_REGEX.test(rawEmail)) fieldErrors.email = 'Email không hợp lệ';

    if (Object.keys(fieldErrors).length > 0) {
      return new Response(JSON.stringify({ error: 'Validation failed', fields: fieldErrors }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const customer_email = rawEmail || null;
    const product_name = validateStr(body.design_name, 200) || null;
    const placement = validateStr(body.placement, 100) || null;
    const size = validateStr(body.size, 100) || null;
    const style = validateStr(body.style, 100) || null;
    const preferred_date = validateStr(body.preferred_date, 20) || null;
    const preferred_time = validateStr(body.preferred_time, 20) || null;
    const note = validateStr(body.note, 500) || null;
    const branch_id = validateUuid(body.branch_id);
    const client_artist_id = validateUuid(body.artist_id);
    const referral_code = validateStr(body.referral_code, 50) || null;
    const total_price = typeof body.total_price === 'number' && body.total_price >= 0 ? body.total_price : null;
    const branch_name = validateStr(body.branch_name, 200) || null;

    // Validate reference_images
    const reference_images: string[] = Array.isArray(body.reference_images)
      ? body.reference_images.slice(0, 10).filter((u: unknown) => typeof u === 'string')
      : [];

    // Insert booking using service role (bypasses RLS, server generates booking_code)
    const supabase = createClient(supabaseUrl, serviceKey);

    // Server-side artist assignment with availability check
    let artist_id = client_artist_id;
    if (!artist_id && branch_id && preferred_date) {
      // Get active artists for the branch
      const { data: branchArtists } = await supabase
        .from('artists')
        .select('id')
        .eq('branch_id', branch_id)
        .eq('is_active', true);

      if (branchArtists && branchArtists.length > 0) {
        // Find artists who already have bookings at the same date+time
        let busyArtistIds: string[] = [];
        if (preferred_time) {
          const { data: busyBookings } = await supabase
            .from('bookings')
            .select('artist_id')
            .eq('preferred_date', preferred_date)
            .eq('preferred_time', preferred_time)
            .not('artist_id', 'is', null)
            .in('booking_status', ['new', 'confirmed']);

          busyArtistIds = (busyBookings || []).map((b) => b.artist_id!);
        }

        const availableArtists = branchArtists.filter((a) => !busyArtistIds.includes(a.id));

        if (availableArtists.length > 0) {
          artist_id = availableArtists[Math.floor(Math.random() * availableArtists.length)].id;
        } else {
          // Fallback: all busy, assign randomly anyway
          console.warn('All artists busy for', preferred_date, preferred_time, '— assigning randomly');
          artist_id = branchArtists[Math.floor(Math.random() * branchArtists.length)].id;
        }
      }
    }

    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        customer_name,
        customer_phone,
        customer_email,
        product_name,
        placement,
        size,
        notes: note,
        note,
        preferred_date,
        preferred_time,
        reference_images,
        branch_id,
        branch_name,
        artist_id,
        referral_code,
        total_price,
        payment_status: 'unpaid',
        booking_status: 'new',
      })
      .select('booking_code, id')
      .single();

    if (insertError || !booking) {
      console.error('Booking insert error:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to create booking' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send booking email notification (fire and forget)
    try {
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
      if (RESEND_API_KEY) {
        const escapeHtml = (text: string) => text
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

        const safeCode = escapeHtml(booking.booking_code);
        const htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #d4a843;">🔔 Booking mới — ${safeCode}</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Mã booking</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${safeCode}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Khách hàng</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(customer_name)}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">SĐT</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(customer_phone)}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(customer_email || 'N/A')}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Mẫu</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(product_name || 'N/A')}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Vị trí</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(placement || 'N/A')}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Kích thước</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(size || 'N/A')}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Phong cách</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(style || 'N/A')}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Ngày hẹn</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(preferred_date || '')} · ${escapeHtml(preferred_time || '')}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">Ghi chú</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(note || 'Không có')}</td></tr>
            </table>
            <p style="margin-top: 20px; color: #888; font-size: 12px;">— ROWENA Tattoo Studio</p>
          </div>`;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'ROWENA Tattoo <no-reply@thuanlam.id.vn>',
            to: ['lamhoangminhthuan@gmail.com'],
            subject: `[ROWENA] New Booking ${safeCode}`,
            html: htmlBody,
          }),
        });
      }
    } catch (emailErr) {
      console.warn('Email notification failed:', emailErr);
    }

    return new Response(JSON.stringify({
      booking_code: booking.booking_code,
      booking_id: booking.id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
