// Move the entire content of your ConcertCalendar component here
// from public/components/ConcertCalendar.tsx
import { format } from 'date-fns';

interface Concert {
  id: string;
  date: Date;
  time: string;
  venue: string;
  ticketUrl: string;
}

const ConcertCalendar = ({ concerts }: { concerts: Concert[] }) => {
  // Sort concerts by date
  const sortedConcerts = concerts.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Upcoming Concerts</h2>

      <div className="space-y-4">
        {sortedConcerts.map((concert) => (
          <div
            key={concert.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">
                  {format(concert.date, 'MMMM d, yyyy')}
                </div>
                <div className="text-gray-600">{concert.time}</div>
                <div className="text-gray-700">{concert.venue}</div>
              </div>
              <a
                href={concert.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Get Tickets
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConcertCalendar;
