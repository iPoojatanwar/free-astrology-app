
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { checkAuth } from './redux/authSlice';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BirthChart from './pages/BirthChart';
import KundliMatching from './pages/KundliMatching';
import Panchang from './pages/Panchang';
import MyReports from './pages/MyReports';
import ReportDetails from './pages/ReportDetails';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
<Route path="/reports/birth-chart" element={<BirthChart />} />
<Route path="/reports/kundli-matching" element={<KundliMatching />} />
<Route path="/reports/panchang" element={<Panchang />} />
<Route path="/reports" element={<MyReports />} />
<Route path="/reports/view/:id" element={<ReportDetails />} />
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
          404 - Page Not Found
        </div>
      } />
    </Routes>
  );
};

export default App;
