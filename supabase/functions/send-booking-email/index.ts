import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MAX_FIELD_LENGTH = 500;

function validateString(val: unknown, maxLen: number = MAX_FIELD_LENGTH): string {
  if (val === null || val === undefined) return '';
  if (typeof val !== 'string') return '';
  return val.slice(0, maxLen);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();

    const booking_code = validateString(body.booking_code, 50);
    const customer_name = validateString(body.customer_name, 200);
    const phone = validateString(body.phone, 20);
    const email = validateString(body.email, 255);
    const design_name = validateString(body.design_name, 200);
    const placement = validateString(body.placement, 100);
    const size = validateString(body.size, 100);
    const appointment_date = validateString(body.appointment_date, 20);
    const appointment_time = validateString(body.appointment_time, 20);
    const note = validateString(body.note, 500);

    if (!booking_code) {
      return new Response(JSON.stringify({ error: 'Missing booking_code' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Verify booking exists
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

    // Send via transactional email system
    try {
      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'booking-notification',
          recipientEmail: 'lamhoangminhthuan@gmail.com',
          idempotencyKey: `booking-notify-${booking.id}`,
          templateData: {
            booking_code,
            customer_name,
            phone,
            email: email || 'N/A',
            design_name,
            placement: placement || 'N/A',
            size: size || 'N/A',
            appointment_date,
            appointment_time,
            note: note || 'Không có',
          },
        },
      });
    } catch (emailErr) {
      console.error('Failed to send booking notification email:', emailErr);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ success: true, email_sent: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
