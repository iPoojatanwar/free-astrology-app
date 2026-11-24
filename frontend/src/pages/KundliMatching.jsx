
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LocationInput from '../components/LocationInput';
import ReportData from '../components/ReportData';
import { getKundliMatch } from '../services/astrologyApi';
import {
  Heart,
  FileText,
  ArrowRight,
  UserRound,
  Sparkles,
} from 'lucide-react';

const initialPerson = {
  date: '',
  time: '',
  place: null,
};

const getReportData = (response) =>
  response?.report?.reportData?.reportData ??
  response?.report?.reportData ??
  response?.reportData?.reportData ??
  response?.reportData ??
  response?.data ??
  response;

const KundliMatching = () => {
  const [boy, setBoy] = useState({ ...initialPerson });
  const [girl, setGirl] = useState({ ...initialPerson });
  const [result, setResult] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!boy.place || !girl.place) {
      setError('Please select both birth locations');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);
      setReportId(null);

      const convert = (person) => ({
        date: person.date,
        time: person.time + ':00',
        latitude: Number(person.place.latitude),
        longitude: Number(person.place.longitude),
        timezone: Number(person.place.timezone),
      });

      const response = await getKundliMatch({
        boy_birth_details: convert(boy),
        girl_birth_details: convert(girl),
      });

      const report = getReportData(response);

      if (!report || typeof report !== 'object') {
        throw new Error('Matching report data is not available');
      }

      setResult(report);
      setReportId(response?.report?._id || response?._id || null);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Matching failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const personForm = (title, person, setPerson, icon) => (
    <div className="bg-white rounded-2xl border border-purple-100 p-5 sm:p-6 space-y-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
          {icon}
        </div>
        <h2 className="font-bold text-xl text-purple-900">
          {title}
        </h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date of Birth
        </label>
        <input
          required
          type="date"
          min="1800-01-01"
          max="2100-12-31"
          value={person.date}
          onChange={(e) =>
            setPerson({ ...person, date: e.target.value })
          }
          className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time of Birth
        </label>
        <input
          required
          type="time"
          value={person.time}
          onChange={(e) =>
            setPerson({ ...person, time: e.target.value })
          }
          className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
        />
      </div>

      <LocationInput
        value={person.place}
        onChange={(place) =>
          setPerson({ ...person, place })
        }
      />
    </div>
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#faf8ff] px-4 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-9">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 flex items-center justify-center">
              <Heart className="text-purple-700" size={30} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
              Kundli Matching
            </h1>

            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Compare two birth charts and explore Vedic compatibility.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-5">
              {personForm(
                'Boy Details',
                boy,
                setBoy,
                <UserRound size={21} />
              )}

              {personForm(
                'Girl Details',
                girl,
                setGirl,
                <UserRound size={21} />
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white p-4 rounded-xl font-semibold disabled:opacity-60 transition"
            >
              <Sparkles size={19} />
              {loading ? 'Generating Report...' : 'Generate Compatibility Report'}
            </button>
          </form>

          {result && (
            <div className="mt-9 space-y-5">

              <div className="bg-white border border-purple-100 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Heart className="text-purple-700" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Compatibility Report
                    </h2>
                    <p className="text-sm text-gray-500">
                      Your Kundli matching results
                    </p>
                  </div>
                </div>

                {reportId && (
                  <Link
                    to={`/reports/view/${reportId}`}
                    className="mt-5 inline-flex items-center gap-2 text-purple-700 font-semibold hover:text-purple-900"
                  >
                    <FileText size={18} />
                    View Saved Report
                    <ArrowRight size={18} />
                  </Link>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white border border-purple-100 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Boy</p>
                  <h3 className="font-bold text-gray-900 mt-1">
                    {boy.place?.place || 'Birth Details'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {boy.date} · {boy.time}
                  </p>
                </div>

                <div className="bg-white border border-purple-100 rounded-2xl p-5">
                  <p className="text-sm text-gray-500">Girl</p>
                  <h3 className="font-bold text-gray-900 mt-1">
                    {girl.place?.place || 'Birth Details'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {girl.date} · {girl.time}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-purple-100 rounded-2xl p-5 sm:p-6 shadow-sm">
                <ReportData
                  data={result}
                  title="Detailed Matching Analysis"
                />
              </div>

            </div>
          )}

        </div>
      </main>
    </>
  );
};

export default KundliMatching;
