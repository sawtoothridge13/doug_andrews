'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

interface Concert {
  id: string;
  date: string;
  time: string;
  venue: string;
  ticketUrl?: string;
  ticketType: string;
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
    ticketType: 'url',
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
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to save concert');
      }

      const savedConcert = await response.json();
      console.log('Saved concert:', savedConcert); // For debugging

      setFormData({
        date: '',
        time: '',
        venue: '',
        ticketUrl: '',
        ticketType: 'url',
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
      date: new Date(concert.date).toISOString().split('T')[0], // Format date correctly
      time: concert.time,
      venue: concert.venue,
      ticketUrl: concert.ticketUrl || '',
      ticketType: concert.ticketType || 'url', // Provide default
      description: concert.description || '',
    });
  }

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
      });
      router.push('/concerts');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Logout
          </button>
        </div>

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
              <label className="block text-sm font-medium mb-1">
                Ticket Type
              </label>
              <select
                name="ticketType"
                value={formData.ticketType}
                onChange={(e) =>
                  setFormData({ ...formData, ticketType: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="url">Ticket URL</option>
                <option value="door">Pay at Door</option>
                <option value="donation">Donation</option>
                <option value="free">Free</option>
              </select>
            </div>

            {formData.ticketType === 'url' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ticket URL
                </label>
                <input
                  type="url"
                  name="ticketUrl"
                  value={formData.ticketUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, ticketUrl: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required={formData.ticketType === 'url'}
                />
              </div>
            )}

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
                      ticketType: 'url',
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
                  <div className="text-gray-600 mt-1">
                    Tickets:{' '}
                    {
                      concert.ticketType
                        ? concert.ticketType.charAt(0).toUpperCase() +
                          concert.ticketType.slice(1)
                        : 'URL' // Default value for existing concerts
                    }
                  </div>
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
