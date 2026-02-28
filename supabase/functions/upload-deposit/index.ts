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
    const body = await req.json();
    const { booking_code, deposit_note } = body;
    // Support both old receipt_urls and new receipt_paths
    const receipt_paths: string[] = body.receipt_paths || [];
    const receipt_urls_legacy: string[] = body.receipt_urls || [];

    if (!booking_code || (receipt_paths.length === 0 && receipt_urls_legacy.length === 0)) {
      return new Response(JSON.stringify({ error: 'Missing booking_code or receipt data' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    // Generate signed URLs from paths using service role
    let finalUrls: string[] = [...receipt_urls_legacy];
    for (const path of receipt_paths) {
      const { data: urlData, error: urlErr } = await supabase.storage
        .from('booking-uploads')
        .createSignedUrl(path, 60 * 60 * 24 * 365); // 1 year
      if (urlErr) {
        console.error('Signed URL error for path:', path, urlErr);
      } else if (urlData?.signedUrl) {
        finalUrls.push(urlData.signedUrl);
      }
    }

    if (finalUrls.length === 0) {
      return new Response(JSON.stringify({ error: 'Failed to generate URLs for receipts' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const updateData: Record<string, unknown> = {
      deposit_receipts: finalUrls,
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
