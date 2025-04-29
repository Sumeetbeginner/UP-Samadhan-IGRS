import ComplaintList from '../components/ComplaintList';
import { useState } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  return (
    <div className="container py-6">
      {/* <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="card-body">
            <h3 className="text-gray-500">Total Complaints</h3>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3 className="text-gray-500">Pending</h3>
            <p className="text-3xl font-bold text-amber-500">{stats.pending}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3 className="text-gray-500">In Progress</h3>
            <p className="text-3xl font-bold text-blue-500">{stats.inProgress}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3 className="text-gray-500">Resolved</h3>
            <p className="text-3xl font-bold text-emerald-500">{stats.resolved}</p>
          </div>
        </div>
      </div> */}

      <ComplaintList />
    </div>
  );
};

export default Dashboard;