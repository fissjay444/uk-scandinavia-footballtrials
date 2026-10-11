import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';

const allowedDestinations = new Set(['United Kingdom', 'Norway', 'Sweden', 'Denmark']);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const required = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'nationality', 'currentCountry', 'position'];
    if (required.some((field) => typeof body[field] !== 'string' || !(body[field] as string).trim())) {
      return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 });
    }
    if (!emailPattern.test(String(body.email))) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    if (String(body.phone).length < 7) return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
    const destinations = Array.isArray(body.destinations) ? body.destinations.filter((item): item is string => typeof item === 'string' && allowedDestinations.has(item)) : [];
    if (!destinations.length) return NextResponse.json({ error: 'Choose at least one preferred destination.' }, { status: 400 });
    if (body.privacyConsent !== true || body.eligibilityAcknowledged !== true) return NextResponse.json({ error: 'Please accept both required acknowledgements.' }, { status: 400 });

    const birthDate = new Date(String(body.dateOfBirth));
    if (Number.isNaN(birthDate.getTime()) || birthDate > new Date()) return NextResponse.json({ error: 'Please enter a valid date of birth.' }, { status: 400 });
    const isMinor = new Date().getFullYear() - birthDate.getFullYear() - (new Date() < new Date(new Date().getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0) < 18;
    if (isMinor && (!String(body.guardianName || '').trim() || !emailPattern.test(String(body.guardianEmail || '')) || String(body.guardianPhone || '').length < 7)) {
      return NextResponse.json({ error: 'Parent or guardian contact details are required for players under 18.' }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    const { data: applicationReference, error } = await supabase.rpc('submit_player_application', {
      p_first_name: String(body.firstName).trim(),
      p_last_name: String(body.lastName).trim(),
      p_email: String(body.email).trim().toLowerCase(),
      p_phone: String(body.phone).trim(),
      p_date_of_birth: String(body.dateOfBirth),
      p_nationality: String(body.nationality).trim(),
      p_current_country: String(body.currentCountry).trim(),
      p_position: String(body.position).trim(),
      p_preferred_foot: body.preferredFoot || null,
      p_height: body.height || null,
      p_current_club: body.currentClub || null,
      p_playing_experience: body.playingExperience || null,
      p_video_url: body.videoUrl || null,
      p_preferred_destinations: destinations,
      p_guardian_name: body.guardianName || null,
      p_guardian_email: body.guardianEmail || null,
      p_guardian_phone: body.guardianPhone || null,
    });

    if (error || !applicationReference) {
      console.error('registration insert failed', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      });
      return NextResponse.json({ error: 'We could not save your application. Please try again.' }, { status: 500 });
    }
    return NextResponse.json({
      applicationReference,
      checkoutUrl: 'https://selar.com/04sw231555',
    });
  } catch (error) {
    console.error('registration request failed', error);
    return NextResponse.json({ error: 'We could not save your application. Please try again.' }, { status: 500 });
  }
}
