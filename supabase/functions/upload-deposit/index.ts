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
    const { booking_code, receipt_urls, deposit_note } = await req.json();

    if (!booking_code || !receipt_urls || receipt_urls.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing booking_code or receipt_urls' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate booking_code length/format
    if (typeof booking_code !== 'string' || booking_code.length > 20) {
      return new Response(JSON.stringify({ error: 'Invalid booking code' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Verify booking exists
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .select('id, note')
      .eq('booking_code', booking_code)
      .single();

    if (bookingErr || !booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update booking with deposit receipts using service role (bypasses RLS)
    const updateData: Record<string, unknown> = {
      deposit_receipts: receipt_urls,
      payment_status: 'pending_verify',
    };
    if (deposit_note) {
      updateData.note = booking.note ? `${booking.note}\n[Deposit note]: ${deposit_note}` : `[Deposit note]: ${deposit_note}`;
    }

    const { error: updateErr } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('booking_code', booking_code);

    if (updateErr) {
      console.error('Update error:', updateErr);
      return new Response(JSON.stringify({ error: 'Failed to update booking' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
