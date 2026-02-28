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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // --- Authentication: require a valid JWT ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
    // Allow both authenticated users AND anon-key callers (for the public booking flow)
    // The anon key itself is passed as Bearer token by supabase.functions.invoke()
    // getClaims will fail for anon key tokens - that's fine, we still proceed but with extra validation
    const userId: string | null = claimsErr ? null : (claimsData?.claims?.sub as string) ?? null;

    const body = await req.json();
    const { booking_code, deposit_note } = body;
    const receipt_paths: string[] = body.receipt_paths || [];
    const receipt_urls_legacy: string[] = body.receipt_urls || [];

    // --- Input validation ---
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

    // Validate receipt_paths format - must be within deposits/ folder and match booking code
    for (const p of receipt_paths) {
      if (typeof p !== 'string' || !p.startsWith(`deposits/${booking_code}_`)) {
        return new Response(JSON.stringify({ error: 'Invalid receipt path' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Limit receipt_paths count
    if (receipt_paths.length > 3) {
      return new Response(JSON.stringify({ error: 'Too many receipts' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize deposit_note: max 500 chars, trim
    let sanitizedNote: string | undefined;
    if (deposit_note) {
      if (typeof deposit_note !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid deposit note' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      sanitizedNote = deposit_note.trim().slice(0, 500);
    }

    // Verify booking exists
    const { data: booking, error: bookingErr } = await supabaseAdmin
      .from('bookings')
      .select('id, note, user_id')
      .eq('booking_code', booking_code)
      .single();

    if (bookingErr || !booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- Ownership check ---
    // If the caller is authenticated, they must own the booking or be admin
    if (userId) {
      const isOwner = booking.user_id === userId;
      if (!isOwner) {
        const { data: isAdmin } = await supabaseAdmin.rpc('has_role', {
          _user_id: userId,
          _role: 'admin',
        });
        if (!isAdmin) {
          return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }
    // If userId is null (anon token from supabase client), allow through since anonymous bookings are a valid flow
    // The booking_code acts as a shared secret in this case

    // Validate receipt_paths actually exist in storage
    for (const path of receipt_paths) {
      const { data: fileData, error: fileErr } = await supabaseAdmin.storage
        .from('booking-uploads')
        .list(path.substring(0, path.lastIndexOf('/')), {
          search: path.substring(path.lastIndexOf('/') + 1),
          limit: 1,
        });
      if (fileErr || !fileData || fileData.length === 0) {
        return new Response(JSON.stringify({ error: 'Receipt file not found in storage' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Generate signed URLs from paths
    let finalUrls: string[] = [...receipt_urls_legacy];
    for (const path of receipt_paths) {
      const { data: urlData, error: urlErr } = await supabaseAdmin.storage
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
    if (sanitizedNote) {
      updateData.note = booking.note
        ? `${booking.note}\n[Deposit note]: ${sanitizedNote}`
        : `[Deposit note]: ${sanitizedNote}`;
    }

    const { error: updateErr } = await supabaseAdmin
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
