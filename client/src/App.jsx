import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import NewComplaint from './pages/NewComplaint';
import ViewComplaint from './pages/ViewComplaint';
import { useEffect } from 'react';
import './styles/main.css';

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.success) {
      alert(location.state.success);
      window.history.replaceState({}, '');
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new-complaint" element={<NewComplaint />} />
        <Route path="/complaint/:id" element={<ViewComplaint />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;