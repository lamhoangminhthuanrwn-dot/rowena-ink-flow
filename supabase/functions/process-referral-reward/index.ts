import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claimsData, error: claimsError } = await anonClient.auth.getUser();
    if (claimsError || !claimsData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: claimsData.user.id, _role: 'admin' });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin only' }), { status: 403, headers: corsHeaders });
    }

    const { booking_id } = await req.json();
    if (!booking_id) {
      return new Response(JSON.stringify({ error: 'booking_id required' }), { status: 400, headers: corsHeaders });
    }

    const { data: booking } = await supabase.from('bookings').select('*').eq('id', booking_id).single();
    if (!booking) {
      return new Response(JSON.stringify({ message: 'Booking not found, skipping' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Calculate reward: 10% of total_price, or fallback to 300K if price not set yet
    const bookingAmount = booking.total_price || 0;

    let referrerId: string | null = null;
    let referredId: string | null = booking.user_id || null;

    // Path 1: Check profile's referred_by_user_id (registered user)
    if (booking.user_id) {
      const { data: profile } = await supabase.from('profiles').select('referred_by_user_id').eq('id', booking.user_id).single();
      if (profile?.referred_by_user_id) {
        referrerId = profile.referred_by_user_id;
      }
    }

    // Path 2: Check booking's referral_code (guest or registered user without profile ref)
    if (!referrerId && booking.referral_code) {
      const { data: referrerProfile } = await supabase.from('profiles').select('id').eq('referral_code', booking.referral_code).single();
      if (referrerProfile) {
        referrerId = referrerProfile.id;
        if (!referredId) {
          referredId = booking.id;
        }
      }
    }

    if (!referrerId) {
      return new Response(JSON.stringify({ message: 'No referrer found, skipping' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Use atomic DB function with booking amount for 10% calculation
    const { data: rewarded, error: rpcError } = await supabase.rpc('add_referral_reward', {
      _referrer_id: referrerId,
      _referred_id: referredId!,
      _booking_code: booking.booking_code,
      _booking_amount: bookingAmount,
    });

    if (rpcError) {
      console.error('add_referral_reward error:', rpcError);
      return new Response(JSON.stringify({ error: 'Failed to process reward' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!rewarded) {
      return new Response(JSON.stringify({ message: 'Reward already granted or amount is 0' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const rewardAmount = bookingAmount > 0 ? Math.floor(bookingAmount * 10 / 100) : 300000;
    return new Response(JSON.stringify({ success: true, amount: rewardAmount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing referral reward:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
