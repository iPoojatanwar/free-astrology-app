
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Sparkles, Sun, Moon, Heart, ArrowRight } from 'lucide-react';

const Home = () => {
  const services = [
    {
      title: 'Birth Chart',
      description: 'Explore your planetary positions and birth chart.',
      icon: Sun,
    },
    {
      title: 'Kundli Matching',
      description: 'Explore compatibility between two birth charts.',
      icon: Heart,
    },
    {
      title: 'Panchang',
      description: 'Explore important daily Vedic calendar details.',
      icon: Moon,
    },
  ];

  return (
    <>
      <Navbar />

      <main className="bg-[#faf8ff] min-h-screen">
        <section className="max-w-7xl mx-auto px-5 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm">
            <Sparkles size={16} /> Free Astrology Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mt-7 leading-tight">
            Discover Your Future <br />
            <span className="text-purple-700">With Free Astrology</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-600 mt-6 text-lg">
            Explore your birth chart, understand compatibility and discover
            Vedic astrology insights with our free astrology services.
          </p>

          <Link to="/register" className="inline-flex items-center gap-2 mt-9 bg-purple-700 hover:bg-purple-800 text-white px-7 py-4 rounded-xl font-semibold">
            Get Started <ArrowRight size={19} />
          </Link>
        </section>

        <section className="max-w-7xl mx-auto px-5 pb-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explore Our Astrology Services
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map(({ title, description, icon: Icon }) => (
              <div key={title} className="bg-white p-8 rounded-3xl border border-purple-100 shadow-sm hover:shadow-lg transition">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Icon size={28} />
                </div>
                <h3 className="font-bold text-xl mt-6">{title}</h3>
                <p className="text-gray-600 mt-3">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
