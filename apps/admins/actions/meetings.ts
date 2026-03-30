'use server';

interface cancelMeetingProps {
  id: string;
  reason: string;
}

export function cancelMeeting({ id, reason }: cancelMeetingProps) {
  try {
    const options = {
      method: 'POST',
      headers: { 'cal-api-version': '2026-02-25', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cancellationReason: reason,
        cancelSubsequentBookings: true
      })
    };
    fetch(`https://api.cal.com/v2/bookings/${id}/cancel`, options);
  } catch (error) {
    console.error(error);
  }
}
