'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

interface Concert {
  id: string;
  date: string;
  time: string;
  venue: string;
  ticketUrl: string;
  description?: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    venue: '',
    ticketUrl: '',
    description: '',
  });
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (session?.user && !session.user.isAdmin) {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchConcerts();
  }, []);

  async function fetchConcerts() {
    try {
      const response = await fetch('/api/concerts');
      if (!response.ok) {
        throw new Error('Failed to fetch concerts');
      }
      const data = await response.json();
      setConcerts(data);
    } catch (error) {
      console.error('Error fetching concerts:', error);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch('/api/concerts', {
        method: editingConcert ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          editingConcert ? { ...formData, id: editingConcert.id } : formData,
        ),
      });

      if (!response.ok) {
        throw new Error('Failed to save concert');
      }

      setFormData({
        date: '',
        time: '',
        venue: '',
        ticketUrl: '',
        description: '',
      });
      setEditingConcert(null);
      await fetchConcerts();
    } catch (error) {
      console.error('Error saving concert:', error);
      alert('Failed to save concert. Please try again.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this concert?')) {
      return;
    }

    const response = await fetch(`/api/concerts?id=${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchConcerts();
    }
  }

  function handleEdit(concert: Concert) {
    setEditingConcert(concert);
    setFormData({
      date: concert.date.split('T')[0], // Format date for input
      time: concert.time,
      venue: concert.venue,
      ticketUrl: concert.ticketUrl,
      description: concert.description || '',
    });
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingConcert ? 'Edit Concert' : 'Add New Concert'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Venue
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ticket URL
              </label>
              <input
                type="url"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={formData.ticketUrl}
                onChange={(e) =>
                  setFormData({ ...formData, ticketUrl: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editingConcert ? 'Update Concert' : 'Add Concert'}
              </button>
              {editingConcert && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingConcert(null);
                    setFormData({
                      date: '',
                      time: '',
                      venue: '',
                      ticketUrl: '',
                      description: '',
                    });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Concerts</h2>
          <div className="space-y-4">
            {concerts.map((concert) => (
              <div
                key={concert.id}
                className="border rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <div className="font-semibold">
                    {new Date(concert.date).toLocaleDateString()}
                  </div>
                  <div className="text-gray-600">{concert.time}</div>
                  <div className="text-gray-700">{concert.venue}</div>
                  {concert.description && (
                    <div className="text-gray-600 mt-2">
                      {concert.description}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(concert)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(concert.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                  <a
                    href={concert.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-600"
                  >
                    View Tickets
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
