import twilio from 'twilio';

/**
 * Sends a WhatsApp notification to the admin when a new booking is submitted.
 * Requires environment variables: TWILIO_SID, TWILIO_AUTH_TOKEN, ADMIN_WHATSAPP_NUMBER
 */
export async function sendWhatsApp(booking: any) {
  try {
    const sid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;

    if (!sid || !authToken || !adminPhone) {
      console.warn('WhatsApp notification skipped: Twilio credentials or admin phone missing in .env');
      return;
    }

    const client = twilio(sid, authToken);

    const functions = Object.keys(booking.selected_functions).join(', ');
    const totalItems = Object.values(booking.selected_functions as Record<string, string[]>)
      .reduce((sum, arr) => sum + arr.length, 0);

    const message =
      `🌸 *New Booking — Shree Annapurna Events*\n\n` +
      `👤 Client: ${booking.client_name}\n` +
      `📞 Phone: ${booking.phone}\n` +
      `📅 Wedding Date: ${booking.wedding_date}\n` +
      `📍 Venue: ${booking.venue}, ${booking.city}\n` +
      `👥 Guests: ${booking.guest_count ?? 'Not mentioned'}\n` +
      `🎊 Functions: ${functions}\n` +
      `✅ Total Services: ${totalItems}\n` +
      `📝 Notes: ${booking.notes ?? 'None'}`;

    await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio SandBox number
      to: `whatsapp:${adminPhone}`,
      body: message
    });
    
    console.log('WhatsApp notification sent successfully');
  } catch (err) {
    console.error('WhatsApp notification failed:', err);
    // Silent failure to prevent booking interruption
  }
}
