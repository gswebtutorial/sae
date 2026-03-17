import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWhatsApp } from '@/lib/sendWhatsApp';

// POST /api/bookings — client submits a new booking
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        client_name: body.clientName,
        phone: body.phone,
        email: body.email || null,
        wedding_date: body.weddingDate,
        venue: body.venue,
        city: body.city,
        guest_count: body.guestCount ? parseInt(body.guestCount) : null,
        notes: body.notes || null,
        selected_functions: body.selectedFunctions,
      }])
      .select()
      .single();

    if (error) throw error;

    // Proactively notify admin via WhatsApp
    // We wrap this in a fire-and-forget style or at least don't let it block
    // but Next.js edge/serverless might kill it if we don't await. 
    // Given the importance, we await.
    await sendWhatsApp(data);

    return NextResponse.json({ success: true, bookingId: data.id }, { status: 201 });
  } catch (err: any) {
    console.error('Booking submission error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// GET /api/bookings — admin fetches all bookings
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token !== process.env.ADMIN_SECRET_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not configured. Please add Supabase keys to .env.local',
        isConfigurationError: true 
      }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, bookings: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
