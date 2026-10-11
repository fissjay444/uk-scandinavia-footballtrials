import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';

function signatureMatches(rawBody: string, signature: string, secret: string) {
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const received = Buffer.from(signature, 'utf8');
  const calculated = Buffer.from(expected, 'utf8');
  return received.length === calculated.length && timingSafeEqual(received, calculated);
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const secret = process.env.SELAR_WEBHOOK_SECRET;
    const signature = request.headers.get('x-selar-signature') || request.headers.get('x-webhook-signature');
    if (!secret || !signature || !signatureMatches(rawBody, signature, secret))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = JSON.parse(rawBody) as Record<string, unknown>;
    const eventId = typeof payload.id === 'string' ? payload.id : typeof payload.event_id === 'string' ? payload.event_id : '';
    const eventType = typeof payload.event === 'string' ? payload.event : typeof payload.type === 'string' ? payload.type : '';
    const paymentReference = typeof payload.payment_reference === 'string' ? payload.payment_reference : typeof payload.reference === 'string' ? payload.reference : null;
    const applicationReference = typeof payload.application_reference === 'string' ? payload.application_reference : null;
    if (!eventId || !eventType) return NextResponse.json({ error: 'Invalid event' }, { status: 400 });

    const supabase = getSupabaseServer();

    // Deduplicate by provider event ID
    const { data: existing } = await supabase
      .from('payments')
      .select('id')
      .eq('provider_event_id', eventId)
      .maybeSingle();
    if (existing) return NextResponse.json({ received: true });

    // Find the matching application by reference or payment reference
    const { data: application } = applicationReference
      ? await supabase.from('player_applications').select('id, payment_status').eq('application_reference', applicationReference).maybeSingle()
      : paymentReference
        ? await supabase.from('player_applications').select('id, payment_status').eq('payment_reference', paymentReference).maybeSingle()
        : { data: null };

    // Record the event
    const { error: eventError } = await supabase.from('payments').insert({
      provider_event_id: eventId,
      payment_reference: paymentReference,
      application_id: application?.id || null,
      event_type: eventType,
      payload,
    });
    if (eventError) {
      console.error('payment event insert failed', eventError);
      return NextResponse.json({ error: 'Could not record event' }, { status: 500 });
    }

    // Only update payment status for verified success events
    if (application?.id && ['payment.success', 'payment.completed', 'paid', 'successful'].includes(eventType) && application.payment_status !== 'paid') {
      const { data: registrationCode, error: codeError } = await supabase.rpc('next_registration_code');
      if (codeError || typeof registrationCode !== 'string') {
        console.error('registration code generation failed', codeError);
        return NextResponse.json({ error: 'Could not generate registration code' }, { status: 500 });
      }
      const { error: updateError } = await supabase
        .from('player_applications')
        .update({
          payment_status: 'paid',
          application_status: 'paid',
          payment_reference: paymentReference,
          registration_code: registrationCode,
          payment_details: payload,
          updated_at: new Date().toISOString(),
        })
        .eq('id', application.id)
        .eq('payment_status', 'pending');
      if (updateError) {
        console.error('payment update failed', updateError);
        return NextResponse.json({ error: 'Could not update payment' }, { status: 500 });
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('selar webhook failed', error);
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }
}
