import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/client/login
export async function POST(request: Request) {
  try {
    const { name, city, phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Lookup booking by phone number
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('phone', phone);
    
    if (name) query = query.ilike('client_name', name);
    if (city) query = query.ilike('city', city);

    const { data, error } = await query
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'No previous booking found with these details' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      booking: data 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
