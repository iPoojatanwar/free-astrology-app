
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { Sparkles } from 'lucide-react';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-purple-100">
        <div className="text-center mb-7">
          <div className="mx-auto bg-purple-100 text-purple-700 w-14 h-14 rounded-2xl flex items-center justify-center">
            <Sparkles size={28} />
          </div>
          <h1 className="text-3xl font-bold mt-4">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Login to your astrology account</p>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-xl border outline-none focus:border-purple-500"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            required
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl border outline-none focus:border-purple-500"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold p-3 rounded-xl disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-700 font-semibold">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
