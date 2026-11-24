
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReport = async () => {
      try {
        const { data } = await api.get(`/reports/${id}`);
        setReport(data.report);
      } catch (err) {
        setError(err.response?.data?.message || 'Report not found');
      }
    };

    loadReport();
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#faf8ff] p-5 py-10">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border p-6">
          {error && <p className="text-red-600">{error}</p>}

          {!report && !error && <p>Loading report...</p>}

          {report && (
            <>
              <h1 className="text-2xl font-bold mb-2">{report.reportType.replaceAll('_', ' ')}</h1>
              <p className="text-sm text-gray-500 mb-6">
                Generated: {new Date(report.createdAt).toLocaleString()}
              </p>

              <pre className="text-xs whitespace-pre-wrap break-words overflow-auto max-h-[700px]">
                {JSON.stringify(report.reportData, null, 2)}
              </pre>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ReportDetails;
