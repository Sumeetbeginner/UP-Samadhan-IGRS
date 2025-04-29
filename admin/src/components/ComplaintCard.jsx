import '../styles/main.css';

const ComplaintCard = ({ complaint, onUpdate, onDelete }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'badge-pending';
      case 'in progress':
        return 'badge-in-progress';
      case 'resolved':
        return 'badge-resolved';
      default:
        return '';
    }
  };

  return (
    <div className="complaint-card">
    <div className="card-header">
      <h3 className="card-title">{complaint.category}</h3>
      <span className={`badge ${getStatusClass(complaint.status)}`}>
        {complaint.status}
      </span>
    </div>
    <p className="card-description">{complaint.description}</p>
    <div className="card-footer">
      <span className="card-location">Location: {complaint.location}</span>
      <div className="action-buttons">
        <button
          onClick={() => onUpdate(complaint)}
          className="btn btn-primary"
        >
          Update
        </button>
        <button
          onClick={() => onDelete(complaint._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
  );
};

export default ComplaintCard;