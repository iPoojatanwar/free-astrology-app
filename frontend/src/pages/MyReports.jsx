
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      const { data } = await api.get('/reports');
      setReports(data.reports || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const deleteReport = async (id) => {
    if (!window.confirm('Delete this report?')) return;

    try {
      await api.delete(`/reports/${id}`);
      setReports((previous) => previous.filter((report) => report._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete report');
    }
  };

  const names = {
    BIRTH_CHART: 'Birth Chart',
    KUNDLI_MATCHING: 'Kundli Matching',
    PANCHANG: 'Panchang',
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#faf8ff] p-5 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Reports</h1>
          <p className="text-gray-500 mb-8">Your previously generated astrology reports.</p>

          {loading && <p>Loading reports...</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {!loading && reports.length === 0 && (
            <div className="bg-white p-10 rounded-2xl text-center">
              <h2 className="font-bold text-xl">No reports yet</h2>
              <p className="text-gray-500 mt-2">Generate your first astrology report.</p>
            </div>
          )}

          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report._id} className="bg-white rounded-2xl p-5 border flex flex-wrap justify-between gap-4">
                <div>
                  <h2 className="font-bold text-lg">
                    {names[report.reportType] || report.reportType}
                  </h2>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/reports/view/${report._id}`}
                    className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => deleteReport(report._id)}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default MyReports;
