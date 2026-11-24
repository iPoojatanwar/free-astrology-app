
import { useState } from 'react';
import { searchLocation } from '../services/astrologyApi';
import { MapPin, Search, Loader2 } from 'lucide-react';

const LocationInput = ({ value, onChange }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a city name');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = await searchLocation(query.trim());

      if (
        data?.latitude == null ||
        data?.longitude == null ||
        data?.timezone == null
      ) {
        throw new Error('Location details not found. Try another city.');
      }

      onChange({
        place: data.place || data.displayName || query,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Unable to find location'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="block font-medium mb-2">
        Birth Location
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600"
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city, e.g. Faridabad, India"
            className="w-full border p-3 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="bg-purple-700 text-white px-4 rounded-xl disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Search size={20} />
          )}
        </button>
      </div>

      {value && (
        <div className="mt-3 bg-purple-50 border border-purple-100 p-3 rounded-xl text-sm">
          <p className="font-semibold text-purple-800">
            Selected Location
          </p>
          <p className="text-gray-700 mt-1">
            {value.place}
          </p>
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default LocationInput;
