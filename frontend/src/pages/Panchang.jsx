
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LocationInput from '../components/LocationInput';
import ReportData from '../components/ReportData';
import { getPanchang } from '../services/astrologyApi';
import {
  Moon,
  FileText,
  ArrowRight,
  CalendarDays,
  MapPin,
  Sparkles,
} from 'lucide-react';

const getReportData = (response) =>
  response?.report?.reportData?.reportData ??
  response?.report?.reportData ??
  response?.reportData?.reportData ??
  response?.reportData ??
  response?.data ??
  response;

const Panchang = () => {
  const [date, setDate] = useState('');
  const [place, setPlace] = useState(null);
  const [result, setResult] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!place) {
      setError('Please select a valid location');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);
      setReportId(null);

      const response = await getPanchang({
        date,
        place: place.place,
        latitude: Number(place.latitude),
        longitude: Number(place.longitude),
        timezone: Number(place.timezone),
      });

      const report = getReportData(response);

      if (!report || typeof report !== 'object') {
        throw new Error('Panchang data is not available');
      }

      setResult(report);
      setReportId(response?.report?._id || response?._id || null);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Unable to generate Panchang'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#faf8ff] px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-9">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 flex items-center justify-center">
              <Moon className="text-purple-700" size={30} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
              Daily Panchang
            </h1>

            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Discover daily Vedic calendar details based on your selected date and location.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-purple-100 rounded-2xl p-5 sm:p-7 space-y-5 shadow-sm"
          >
            <div>
              <label className="font-medium text-gray-700 flex items-center gap-2 mb-2">
                <CalendarDays size={18} className="text-purple-700" />
                Select Date
              </label>

              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700 flex items-center gap-2 mb-2">
                <MapPin size={18} className="text-purple-700" />
                Birth / Preferred Location
              </label>

              <LocationInput
                value={place}
                onChange={setPlace}
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white p-4 rounded-xl font-semibold disabled:opacity-60 transition"
            >
              <Sparkles size={19} />
              {loading ? 'Generating Panchang...' : 'Generate Panchang'}
            </button>
          </form>

          {result && (
            <div className="mt-8 space-y-5">

              <div className="bg-white border border-purple-100 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Moon className="text-purple-700" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Panchang Details
                    </h2>
                    <p className="text-sm text-gray-500">
                      Daily Vedic calendar report
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
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <CalendarDays size={17} />
                    Selected Date
                  </div>
                  <p className="font-bold text-gray-900 mt-2">
                    {date}
                  </p>
                </div>

                <div className="bg-white border border-purple-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin size={17} />
                    Selected Location
                  </div>
                  <p className="font-bold text-gray-900 mt-2">
                    {place?.place}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-purple-100 rounded-2xl p-5 sm:p-6 shadow-sm">
                <ReportData
                  data={result}
                  title="Complete Panchang Information"
                />
              </div>

            </div>
          )}

        </div>
      </main>
    </>
  );
};

export default Panchang;
