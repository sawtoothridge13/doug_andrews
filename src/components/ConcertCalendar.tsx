'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface Concert {
  id: string;
  date: string;
  time: string | null;
  venue: string;
  city?: string;
  state?: string;
  country?: string;
  ticketUrl?: string;
  ticketType: string;
  description?: string;
}

const ConcertCalendar = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetch('/api/concerts');
        console.log('Concert response:', response); // Debug log
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        console.log('Concert data:', data); // Debug log
        setConcerts(data);
      } catch (error) {
        console.error('Error fetching concerts:', error);
      }
    };

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
            <div className="text-gray-600">{concert.time || 'TBA'}</div>
            <div className="text-gray-700">
              {concert.venue}
              {concert.city && `, ${concert.city}`}
              {concert.state && `, ${concert.state}`}
              {concert.country && `, ${concert.country}`}
            </div>
            {concert.description && (
              <div className="text-gray-600 mt-2">{concert.description}</div>
            )}
            {concert.ticketUrl && (
              <a
                href={concert.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 mt-2 inline-block"
              >
                Get Tickets
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConcertCalendar;
