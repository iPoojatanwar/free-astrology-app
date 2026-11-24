
import { useState } from 'react';
import {
  Sparkles, CalendarDays, Clock, MapPin,
  Sun, Moon, Star, Orbit, ShieldCheck,
} from 'lucide-react';

import { getBirthChart } from '../services/astrologyApi';
import LocationInput from '../components/LocationInput';
import Navbar from '../components/Navbar';

const formatLabel = (value) =>
  String(value).replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const formatValue = (value) => {
  if (value == null || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.map(formatValue).join(', ');
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, val]) => `${formatLabel(key)}: ${formatValue(val)}`)
      .join(' · ');
  }
  return String(value);
};

const cleanHtml = (value) =>
  String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();

function Section({ icon: Icon, title, children }) {
  return (
    <section className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={20} className="text-purple-700" />
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function DetailGrid({ data }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Object.entries(data || {}).map(([key, value]) => (
        <div key={key} className="bg-purple-50 rounded-xl p-3 min-w-0">
          <p className="text-xs text-gray-500 mb-1">{formatLabel(key)}</p>
          <p className="text-sm font-semibold text-gray-800 break-words">
            {formatValue(value)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function BirthChart() {
  const [form, setForm] = useState({
    date: '',
    time: '',
    place: null,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.place) {
      setError('Please select a valid birth location');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const data = await getBirthChart({
        date: form.date,
        time: form.time + ':00',
        place: form.place.place,
        latitude: Number(form.place.latitude),
        longitude: Number(form.place.longitude),
        timezone: Number(form.place.timezone),
      });

      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Unable to generate birth chart'
      );
    } finally {
      setLoading(false);
    }
  };

  const report =
    result?.report?.reportData ??
    result?.reportData ??
    result?.data ??
    result;

  const horoscope = report?.horoscope;
  const calendar = horoscope?.calendar_info;
  const planets = horoscope?.divisional_charts?.['D-1_rasi'];
  const nakshatra = horoscope?.nakshatra_pada;
  const doshas = horoscope?.doshas;
  const yogas = horoscope?.yogas;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#faf8ff] px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-purple-100 text-purple-700">
              <Sparkles size={30} />
            </div>
            <h1 className="text-3xl font-bold mt-3">Birth Chart</h1>
            <p className="text-gray-500 mt-2">
              Discover your Vedic birth chart
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-5 md:p-7 rounded-3xl border border-purple-100 shadow-sm space-y-5">
            <h2 className="text-lg font-bold">Enter Birth Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time of Birth</label>
                <input
                  required
                  type="time"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-xl"
                />
              </div>
            </div>

            <LocationInput
              value={form.place}
              onChange={place => setForm({ ...form, place })}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              disabled={loading}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
            >
              {loading ? 'Generating...' : 'Generate Birth Chart'}
            </button>
          </form>

          {result && horoscope && (
            <div className="mt-8 space-y-5">
              <div className="text-center">
                <p className="text-sm text-purple-700 font-semibold">YOUR ASTROLOGY REPORT</p>
                <h2 className="text-2xl font-bold mt-1">Your Birth Chart</h2>
              </div>

              <Section icon={CalendarDays} title="Birth Information">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Date of Birth', value: report?.birth_details?.date || form.date, Icon: CalendarDays },
                    { label: 'Birth Time', value: report?.birth_details?.time || form.time, Icon: Clock },
                    { label: 'Birth Place', value: report?.birth_details?.place || form.place?.place, Icon: MapPin },
                  ].map(item => (
                    <div key={item.label} className="bg-purple-50 p-3 rounded-xl flex gap-3 items-center">
                      <item.Icon className="text-purple-700 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="font-semibold text-sm break-words">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {calendar && (
                <Section icon={Sun} title="Panchang Details">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Day', 'Tithi', 'Raasi', 'Nakshatram', 'Yoga', 'Karana'].map(key =>
                      calendar[key] != null && (
                        <div key={key} className="bg-purple-50 rounded-xl p-3">
                          <p className="text-xs text-gray-500">{key}</p>
                          <p className="font-semibold text-sm mt-1">{formatValue(calendar[key])}</p>
                        </div>
                      )
                    )}
                  </div>
                </Section>
              )}

              {planets && (
                <Section icon={Orbit} title="Planetary Positions">
                  <div className="space-y-3">
                    {Object.entries(planets).map(([planet, details]) => (
                      <div key={planet} className="border border-gray-100 rounded-xl p-3">
                        <h3 className="font-bold text-purple-800 mb-2">{formatLabel(planet)}</h3>
                        {typeof details === 'object' && details !== null
                          ? <DetailGrid data={details} />
                          : <p className="text-sm">{formatValue(details)}</p>}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {nakshatra && (
                <Section icon={Moon} title="Nakshatra Details">
                  <DetailGrid data={nakshatra} />
                </Section>
              )}

              {doshas && (
                <Section icon={ShieldCheck} title="Dosha Analysis">
                  <div className="space-y-3">
                    {Object.entries(doshas).map(([name, description]) => (
                      <div key={name} className="bg-purple-50 rounded-xl p-3">
                        <h3 className="font-semibold text-sm mb-1">{name}</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                          {cleanHtml(description)}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {yogas && (
                <Section icon={Star} title="Yoga Analysis">
                  {yogas.summary && (
                    <div className="mb-3">
                      <h3 className="font-semibold mb-2">Summary</h3>
                      <DetailGrid data={yogas.summary} />
                    </div>
                  )}
                  {yogas.yoga_list && (
                    <>
                      <h3 className="font-semibold mb-2">Yoga List</h3>
                      <DetailGrid data={yogas.yoga_list} />
                    </>
                  )}
                </Section>
              )}

            </div>
          )}

          {result && !horoscope && (
            <p className="mt-6 text-center text-red-600">
              Report received, but horoscope data was not found in the response.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
