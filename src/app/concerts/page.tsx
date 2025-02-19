import ConcertCalendar from '@/components/ConcertCalendar';

// This is example data - replace with your actual data source
const sampleConcerts = [
  {
    id: '1',
    date: new Date('2024-04-15'),
    time: '8:00 PM',
    venue: 'The Music Hall',
    ticketUrl: 'https://example.com/tickets/1',
  },
  {
    id: '2',
    date: new Date('2024-04-20'),
    time: '7:30 PM',
    venue: 'City Arena',
    ticketUrl: 'https://example.com/tickets/2',
  },
];

export default function ConcertsPage() {
  return (
    <main className="min-h-screen py-8">
      <ConcertCalendar />
    </main>
  );
}
