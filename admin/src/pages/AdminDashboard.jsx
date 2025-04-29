import { useState, useEffect } from 'react';
import ComplaintCard from '../components/ComplaintCard';
import UpdateModal from '../components/UpdateModal';
import Navbar from '../components/Navbar';
import { fetchComplaints, updateComplaint, deleteComplaint } from '../utils/api';
import '../styles/main.css';
import '../styles/dashboard.css';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await fetchComplaints();
        setComplaints(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  const handleUpdate = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const handleSaveUpdate = async (id, updateData) => {
    try {
      const updatedComplaint = await updateComplaint(id, updateData);
      setComplaints(complaints.map(c => 
        c._id === id ? updatedComplaint : c
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await deleteComplaint(id);
        setComplaints(complaints.filter(c => c._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="container py-8 text-center">Loading...</div>;
  if (error) return <div className="container py-8 text-center text-danger">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container py-8">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        
        <div className="stats-grid mb-8">
          <div className="stat-card bg-blue-50">
            <h3>Total Complaints</h3>
            <p>{complaints.length}</p>
          </div>
          <div className="stat-card bg-yellow-50">
            <h3>Pending</h3>
            <p>{complaints.filter(c => c.status === 'Pending').length}</p>
          </div>
          <div className="stat-card bg-green-50">
            <h3>Resolved</h3>
            <p>{complaints.filter(c => c.status === 'Resolved').length}</p>
          </div>
        </div>

        <div className="complaints-list">
          <h3 className="text-xl font-semibold mb-4">Recent Complaints</h3>
          {complaints.length === 0 ? (
            <p className="text-gray-500">No complaints found</p>
          ) : (
            complaints.map(complaint => (
              <ComplaintCard
                key={complaint._id}
                complaint={complaint}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {showModal && selectedComplaint && (
          <UpdateModal
            complaint={selectedComplaint}
            onClose={() => setShowModal(false)}
            onSave={handleSaveUpdate}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;