import { useState, useEffect } from 'react';
import ComplaintCard from '../components/ComplaintCard';
import StatusFilter from '../components/StatusFilter';
import Navbar from '../components/Navbar';
import { fetchComplaints } from '../utils/api';
import '../styles/main.css';
import '../styles/statuspage.css';

const StatusPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await fetchComplaints();
        setComplaints(data);
        setFilteredComplaints(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  useEffect(() => {
    if (statusFilter === '') {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(complaints.filter(c => c.status === statusFilter));
    }
  }, [statusFilter, complaints]);

  if (loading) return <div className="container py-8 text-center">Loading...</div>;
  if (error) return <div className="container py-8 text-center text-danger">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container py-8">
        <h2 className="text-2xl font-bold mb-6">Complaints Status</h2>
        
        <StatusFilter 
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        <div className="complaints-grid">
          {filteredComplaints.length === 0 ? (
            <p className="text-gray-500 col-span-3 text-center py-8">
              {statusFilter ? `No ${statusFilter} complaints` : 'No complaints found'}
            </p>
          ) : (
            filteredComplaints.map(complaint => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                onUpdate={() => {}}
                onDelete={() => {}}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default StatusPage;