import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to check admin authorization
function authorizeAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  return token === process.env.ADMIN_SECRET_TOKEN;
}

// PATCH /api/bookings/:id — update booking status
export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!authorizeAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ success: true, booking: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/bookings/:id — full update of booking details
export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!authorizeAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({
        client_name: body.clientName,
        phone: body.phone,
        email: body.email || null,
        wedding_date: body.weddingDate,
        venue: body.venue,
        city: body.city,
        guest_count: body.guestCount ? parseInt(body.guestCount) : null,
        notes: body.notes || null,
        selected_functions: body.selectedFunctions,
        status: body.status,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ success: true, booking: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/bookings/:id — delete a booking
export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!authorizeAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return NextResponse.json({ success: true, message: 'Booking deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
