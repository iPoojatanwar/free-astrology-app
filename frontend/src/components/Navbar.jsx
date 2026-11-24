
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { Sparkles, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch {
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <nav className="bg-white border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-purple-800 font-bold text-xl">
          <Sparkles /> AstroFree
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 font-medium">Dashboard</Link>
              <span className="hidden sm:block text-gray-600">{user.name}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-xl">
                <LogOut size={17} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700">Login</Link>
              <Link to="/register" className="bg-purple-700 text-white px-4 py-2 rounded-xl">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
