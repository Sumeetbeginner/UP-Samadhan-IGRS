import { useState, useEffect } from 'react';
import axios from 'axios';
import ComplaintCard from './ComplaintCard';

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/complaints');
        setComplaints(response.data);
      } catch (err) {
        setError('Failed to fetch complaints. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = filter === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Complaints</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('Pending')}
            className={`btn btn-sm ${filter === 'Pending' ? 'btn-primary' : 'btn-outline'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('In Progress')}
            className={`btn btn-sm ${filter === 'In Progress' ? 'btn-primary' : 'btn-outline'}`}
          >
            In Progress
          </button>
          <button 
            onClick={() => setFilter('Resolved')}
            className={`btn btn-sm ${filter === 'Resolved' ? 'btn-primary' : 'btn-outline'}`}
          >
            Resolved
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredComplaints.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-8">
            <svg width="24" height="24"  className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 className="mt-4 text-lg font-medium">No complaints found</h3>
            <p className="mt-1 text-gray-500">
              {filter === 'all' 
                ? 'There are no complaints yet.' 
                : `There are no ${filter.toLowerCase()} complaints.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComplaints.map(complaint => (
            <ComplaintCard key={complaint._id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintList;