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
    if (!booking || !booking.user_id) {
      return new Response(JSON.stringify({ message: 'No user_id on booking, skipping' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: profile } = await supabase.from('profiles').select('referred_by_user_id').eq('id', booking.user_id).single();
    if (!profile?.referred_by_user_id) {
      return new Response(JSON.stringify({ message: 'User not referred, skipping' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: existingReward } = await supabase
      .from('referral_rewards')
      .select('id')
      .eq('referred_id', booking.user_id)
      .limit(1);

    if (existingReward && existingReward.length > 0) {
      return new Response(JSON.stringify({ message: 'Reward already granted for this referred user' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const REWARD_AMOUNT = 300000;
    const referrerId = profile.referred_by_user_id;

    await supabase.from('referral_rewards').insert({
      referrer_id: referrerId,
      referred_id: booking.user_id,
      amount_vnd: REWARD_AMOUNT,
    });

    const { data: existingWallet } = await supabase.from('wallet').select('*').eq('user_id', referrerId).single();
    if (existingWallet) {
      await supabase.from('wallet').update({
        balance_vnd: existingWallet.balance_vnd + REWARD_AMOUNT,
      }).eq('user_id', referrerId);
    } else {
      await supabase.from('wallet').insert({
        user_id: referrerId,
        balance_vnd: REWARD_AMOUNT,
        reserved_vnd: 0,
      });
    }

    await supabase.from('wallet_transactions').insert({
      user_id: referrerId,
      amount_vnd: REWARD_AMOUNT,
      type: 'referral_reward',
      description: `Thưởng giới thiệu từ booking ${booking.booking_code}`,
    });

    return new Response(JSON.stringify({ success: true, amount: REWARD_AMOUNT }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing referral reward:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});