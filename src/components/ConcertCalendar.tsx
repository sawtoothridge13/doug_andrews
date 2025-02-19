'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface Concert {
  id: string;
  date: string;
  time: string;
  venue: string;
  ticketUrl: string;
  description?: string;
}

const ConcertCalendar = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);

  useEffect(() => {
    async function fetchConcerts() {
      const response = await fetch('/api/concerts');
      const data = await response.json();
      setConcerts(data);
    }
    fetchConcerts();
  }, []);

  // Sort concerts by date
  const sortedConcerts = concerts.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Upcoming Concerts</h2>
      <div className="space-y-4">
        {sortedConcerts.map((concert) => (
          <div key={concert.id} className="border rounded-lg p-4">
            <div className="font-semibold">
              {format(new Date(concert.date), 'MMMM d, yyyy')}
            </div>
            <div className="text-gray-600">{concert.time}</div>
            <div className="text-gray-700">{concert.venue}</div>
            {concert.description && (
              <div className="text-gray-600 mt-2">{concert.description}</div>
            )}
            <a
              href={concert.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 mt-2 inline-block"
            >
              Get Tickets
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConcertCalendar;
