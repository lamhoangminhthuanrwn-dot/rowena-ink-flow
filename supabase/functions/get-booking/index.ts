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
    const { booking_code } = await req.json();
    if (!booking_code || typeof booking_code !== 'string' || booking_code.length > 20) {
      return new Response(JSON.stringify({ error: 'Invalid booking_code' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await supabase
      .from('bookings')
      .select('booking_code, customer_name, customer_phone, customer_email, product_name, placement, size, preferred_date, preferred_time, notes, note, branch_name, user_id, artists(name)')
      .eq('booking_code', booking_code)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch referral code if user is logged in
    let referral_code: string | null = null;
    if (data.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', data.user_id)
        .single();
      if (profile?.referral_code) referral_code = profile.referral_code;
    }

    return new Response(JSON.stringify({
      booking: {
        booking_code: data.booking_code,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email,
        product_name: data.product_name,
        placement: data.placement,
        size: data.size,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        notes: data.notes,
        note: data.note,
        branch_name: data.branch_name,
        artist_name: (data.artists as { name: string } | null)?.name || null,
      },
      referral_code,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('get-booking error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
