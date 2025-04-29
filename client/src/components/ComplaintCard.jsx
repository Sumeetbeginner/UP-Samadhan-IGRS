import { Link } from 'react-router-dom';

const statusColors = {
  Pending: 'badge-accent',
  'In Progress': 'badge-primary',
  Resolved: 'badge-secondary'
};

const ComplaintCard = ({ complaint }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg">{complaint.category}</h3>
          <span className={`badge ${statusColors[complaint.status]}`}>
            {complaint.status}
          </span>
        </div>
        
        <p className="text-gray-600 mb-2">
          <svg width="24" height="24"  className="inline mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          {complaint.location}
        </p>
        
        <p className="mb-4">{complaint.description}</p>
        
        {complaint.imageAnalysis?.top_prediction && (
          <div className="text-sm text-gray-500 mb-4">
            <svg width="24" height="24"  className="inline mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
            </svg>
            AI detected: {complaint.imageAnalysis.top_prediction.category} (
            {complaint.imageAnalysis.top_prediction.probability}%)
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/complaint/${complaint._id}`} 
            className="btn btn-outline btn-sm"
          >
            View Details
          </Link>
          <span className="text-sm text-gray-500">
            {new Date(complaint.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;