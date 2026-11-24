
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import {
  Sun,
  Moon,
  Heart,
  ArrowRight,
  FileText,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const reports = [
    {
      title: 'Birth Chart',
      description:
        'Generate your Vedic birth chart and explore planetary positions.',
      path: '/reports/birth-chart',
      icon: Sun,
    },
    {
      title: 'Kundli Matching',
      description:
        'Check compatibility between two birth charts.',
      path: '/reports/kundli-matching',
      icon: Heart,
    },
    {
      title: 'Panchang',
      description:
        'Explore daily Panchang information.',
      path: '/reports/panchang',
      icon: Moon,
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#faf8ff]">
        <div className="max-w-7xl mx-auto px-5 py-12">

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-800 to-indigo-700 rounded-3xl p-8 md:p-12 text-white">
            <p className="text-purple-200">
              Your Astrology Dashboard
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-3">
              Welcome, {user?.name}!
            </h1>

            <p className="mt-4 text-purple-100">
              Discover your astrology insights with free reports.
            </p>

            <Link
              to="/reports"
              className="mt-7 inline-flex items-center gap-2 bg-white text-purple-800 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition"
            >
              <FileText size={19} />
              View My Reports
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Reports Section */}
          <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900">
            Explore Astrology Reports
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {reports.map(({ title, description, path, icon: Icon }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-7 border border-purple-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Icon size={28} />
                </div>

                <h3 className="font-bold text-xl mt-5 text-gray-900">
                  {title}
                </h3>

                <p className="text-gray-600 mt-3 min-h-12">
                  {description}
                </p>

                <Link
                  to={path}
                  className="mt-6 inline-flex items-center gap-2 text-purple-700 font-semibold hover:text-indigo-700 transition"
                >
                  Generate Report
                  <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
};

export default Dashboard;
