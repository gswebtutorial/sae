import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWhatsApp } from '@/lib/sendWhatsApp';

// POST /api/bookings — client submits or updates a booking
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const bookingData: any = {
      client_name: body.clientName,
      phone: body.phone,
      email: body.email || null,
      city: body.city,
      wedding_date: body.weddingDate || '2024-01-01', // Fallback for schema if NOT NULL but we simplified UI
      venue: body.venue || 'Not Specified',
      guest_count: body.guestCount ? parseInt(body.guestCount) : null,
      notes: body.notes || null,
      selected_functions: body.selectedFunctions,
      submitted_at: new Date().toISOString(),
    };

    let result;
    if (body.id) {
      // Update existing booking
      result = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', body.id)
        .select()
        .single();
    } else {
      // Insert new booking
      result = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();
    }

    if (result.error) throw result.error;

    // Notify admin via WhatsApp (of both new and updated bookings)
    await sendWhatsApp(result.data);

    return NextResponse.json({ 
      success: true, 
      bookingId: result.data.id,
      isUpdate: !!body.id 
    }, { status: body.id ? 200 : 201 });
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
