'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';

interface Concert {
  id: string;
  date: string;
  time: string | null;
  venue: string;
  city: string | null;
  state: string | null;
  country: string | null;
  ticketUrl?: string;
  ticketType: string;
  description?: string;
  streetAddress: string;
  postalCode: string;
}

interface VenueSuggestion {
  venue: string;
  streetAddress: string;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  formatted_address: string;
}

// Add interface for form data
interface FormData {
  date: string;
  time: string;
  venue: string;
  city: string;
  state: string;
  country: string;
  ticketUrl: string;
  ticketType: string;
  description: string;
  streetAddress: string;
  postalCode: string;
}

const COUNTRIES = {
  US: 'United States',
  CA: 'Canada',
  UK: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  IT: 'Italy',
  ES: 'Spain',
  PT: 'Portugal',
  IE: 'Ireland',
  NL: 'Netherlands',
  BE: 'Belgium',
  DK: 'Denmark',
  SE: 'Sweden',
  NO: 'Norway',
  FI: 'Finland',
  CH: 'Switzerland',
  AT: 'Austria',
  PL: 'Poland',
  CZ: 'Czech Republic',
  SK: 'Slovakia',
  HU: 'Hungary',
  RO: 'Romania',
  BG: 'Bulgaria',
  GR: 'Greece',
  HR: 'Croatia',
} as const;

const STATES_BY_COUNTRY = {
  US: {
    AL: 'Alabama',
    AK: 'Alaska',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming',
  },
  CA: {
    AB: 'Alberta',
    BC: 'British Columbia',
    MB: 'Manitoba',
    NB: 'New Brunswick',
    NL: 'Newfoundland and Labrador',
    NS: 'Nova Scotia',
    NT: 'Northwest Territories',
    NU: 'Nunavut',
    ON: 'Ontario',
    PE: 'Prince Edward Island',
    QC: 'Quebec',
    SK: 'Saskatchewan',
    YT: 'Yukon',
  },
  UK: {
    ENG: 'England',
    SCT: 'Scotland',
    WLS: 'Wales',
    NIR: 'Northern Ireland',
  },
  DE: {
    BW: 'Baden-Württemberg',
    BY: 'Bavaria',
    BE: 'Berlin',
    BB: 'Brandenburg',
    HB: 'Bremen',
    HH: 'Hamburg',
    HE: 'Hesse',
    MV: 'Mecklenburg-Vorpommern',
    NI: 'Lower Saxony',
    NW: 'North Rhine-Westphalia',
    RP: 'Rhineland-Palatinate',
    SL: 'Saarland',
    SN: 'Saxony',
    ST: 'Saxony-Anhalt',
    SH: 'Schleswig-Holstein',
    TH: 'Thuringia',
  },
  FR: {
    ARA: 'Auvergne-Rhône-Alpes',
    BFC: 'Bourgogne-Franche-Comté',
    BRE: 'Bretagne',
    CVL: 'Centre-Val de Loire',
    COR: 'Corse',
    GES: 'Grand Est',
    HDF: 'Hauts-de-France',
    IDF: 'Île-de-France',
    NOR: 'Normandie',
    NAQ: 'Nouvelle-Aquitaine',
    OCC: 'Occitanie',
    PDL: 'Pays de la Loire',
    PAC: "Provence-Alpes-Côte d'Azur",
  },
  IT: {
    ABR: 'Abruzzo',
    BAS: 'Basilicata',
    CAL: 'Calabria',
    CAM: 'Campania',
    EMR: 'Emilia-Romagna',
    FVG: 'Friuli Venezia Giulia',
    LAZ: 'Lazio',
    LIG: 'Liguria',
    LOM: 'Lombardy',
    MAR: 'Marche',
    MOL: 'Molise',
    PIE: 'Piedmont',
    PUG: 'Puglia',
    SAR: 'Sardinia',
    SIC: 'Sicily',
    TOS: 'Tuscany',
    TAA: 'Trentino-Alto Adige',
    UMB: 'Umbria',
    VDA: "Valle d'Aosta",
    VEN: 'Veneto',
  },
  ES: {
    AND: 'Andalusia',
    ARA: 'Aragon',
    AST: 'Asturias',
    BAL: 'Balearic Islands',
    PVA: 'Basque Country',
    CAN: 'Canary Islands',
    CTB: 'Cantabria',
    CLM: 'Castilla-La Mancha',
    CYL: 'Castile and León',
    CAT: 'Catalonia',
    EXT: 'Extremadura',
    GAL: 'Galicia',
    MAD: 'Madrid',
    MUR: 'Murcia',
    NAV: 'Navarre',
    RIO: 'La Rioja',
    VAL: 'Valencia',
  },
  // Add other European countries' regions as needed
} as const;

// Add this helper function at the top level
const getStateName = (stateCode: string | null, countryCode: string | null) => {
  if (!stateCode || !countryCode) return '';
  return STATES_BY_COUNTRY[countryCode as keyof typeof STATES_BY_COUNTRY]?.[
    stateCode as keyof (typeof STATES_BY_COUNTRY)[keyof typeof STATES_BY_COUNTRY]
  ];
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [formData, setFormData] = useState<FormData>({
    date: '',
    time: '',
    venue: '',
    city: '',
    state: '',
    country: '',
    ticketUrl: '',
    ticketType: 'url',
    description: '',
    streetAddress: '',
    postalCode: '',
  });
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null);
  const [venueSuggestions, setVenueSuggestions] = useState<VenueSuggestion[]>(
    [],
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [stateInputValue, setStateInputValue] = useState('');

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

  // Update the debounce function to be more specific about the function type
  const debounce = <T extends (query: string) => unknown>(
    func: T,
    wait: number,
  ) => {
    let timeout: NodeJS.Timeout;
    return (query: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(query), wait);
    };
  };

  // Fetch venue suggestions
  const fetchVenueSuggestions = debounce(async (query: string) => {
    console.log('Fetching suggestions for:', query); // Debug log

    if (query.length < 2) {
      setVenueSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/venues?q=${encodeURIComponent(query)}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('API response:', text); // Debug log

      if (!text) {
        setVenueSuggestions([]);
        return;
      }

      const data = JSON.parse(text);
      console.log('Parsed suggestions:', data); // Debug log

      if (Array.isArray(data)) {
        setVenueSuggestions(data);
      } else {
        setVenueSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      setVenueSuggestions([]);
    }
  }, 300);

  // Handle venue input change
  const handleVenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, venue: value });
    fetchVenueSuggestions(value);
    setShowSuggestions(true);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: VenueSuggestion) => {
    // Convert full country name to code using Object.entries
    const [countryCode] = Object.entries(COUNTRIES).find(
      ([, name]) => name === suggestion.country,
    ) || [''];

    setFormData({
      ...formData,
      venue: suggestion.venue,
      streetAddress: suggestion.streetAddress || '',
      city: suggestion.city || '',
      state: suggestion.state || '',
      postalCode: suggestion.postalCode || '',
      country: countryCode,
    });
    setStateInputValue(suggestion.state || '');
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        city: '',
        state: '',
        country: '',
        ticketUrl: '',
        ticketType: 'url',
        description: '',
        streetAddress: '',
        postalCode: '',
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

  // Update handleEdit to handle nulls
  function handleEdit(concert: Concert) {
    setEditingConcert(concert);
    setFormData({
      date: new Date(concert.date).toISOString().split('T')[0],
      time: concert.time || '',
      venue: concert.venue,
      streetAddress: concert.streetAddress || '',
      city: concert.city || '',
      state: concert.state || '',
      country: concert.country || '',
      ticketUrl: concert.ticketUrl || '',
      ticketType: concert.ticketType || 'url',
      description: concert.description || '',
      postalCode: concert.postalCode || '',
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
              <label className="block text-sm font-medium mb-1">Time</label>
              <select
                name="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Time</option>
                <option value="TBA">TBA</option>
                {/* Generate time options from 12:00 AM to 11:30 PM */}
                {Array.from({ length: 48 }, (_, i) => {
                  const hour = Math.floor(i / 2);
                  const minute = i % 2 === 0 ? '00' : '30';
                  const ampm = hour < 12 ? 'AM' : 'PM';
                  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                  return `${hour12}:${minute} ${ampm}`;
                }).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-1">Venue</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded"
                value={formData.venue}
                onChange={handleVenueChange}
                onFocus={() => setShowSuggestions(true)}
              />

              {showSuggestions && venueSuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {venueSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div>{suggestion.venue}</div>
                      <div className="text-sm text-gray-500">
                        {[suggestion.city, suggestion.state, suggestion.country]
                          .filter(Boolean)
                          .join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Street Address
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.streetAddress}
                onChange={(e) =>
                  setFormData({ ...formData, streetAddress: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Postal Code
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    country: e.target.value,
                    state: '', // Reset state when country changes
                  });
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Country</option>
                {Object.entries(COUNTRIES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {formData.country === 'US'
                  ? 'State'
                  : formData.country === 'CA'
                  ? 'Province'
                  : formData.country === 'UK'
                  ? 'Region'
                  : 'State/Province/Region'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={stateInputValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStateInputValue(value);
                    setFormData({ ...formData, state: value });
                  }}
                  className="w-full p-2 border rounded"
                  placeholder={`Enter or select ${
                    formData.country === 'US'
                      ? 'State'
                      : formData.country === 'CA'
                      ? 'Province'
                      : 'Region'
                  }`}
                  list="state-options"
                />
                <datalist id="state-options">
                  {formData.country &&
                    Object.entries(
                      STATES_BY_COUNTRY[
                        formData.country as keyof typeof STATES_BY_COUNTRY
                      ] || {},
                    ).map(([code, name]) => (
                      <option key={code} value={name}>
                        {name}
                      </option>
                    ))}
                </datalist>
              </div>
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
                      city: '',
                      state: '',
                      country: '',
                      ticketUrl: '',
                      ticketType: 'url',
                      description: '',
                      streetAddress: '',
                      postalCode: '',
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
                  <div className="text-gray-700">
                    {concert.venue}
                    {concert.city && `, ${concert.city}`}
                    {concert.state &&
                      `, ${
                        getStateName(concert.state, concert.country) ||
                        concert.state
                      }`}
                    {concert.country &&
                      `, ${
                        COUNTRIES[concert.country as keyof typeof COUNTRIES] ||
                        concert.country
                      }`}
                  </div>
                  <div className="text-gray-600">{concert.time || 'TBA'}</div>
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
