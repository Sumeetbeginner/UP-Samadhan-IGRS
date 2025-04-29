import { useState } from 'react';
import '../styles/main.css';

const UpdateModal = ({ complaint, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    status: complaint.status,
    description: complaint.description,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(complaint._id, formData);
    onClose();
  };

  return (
<div className="update-modal-overlay">
  <div className="update-modal-container">
    <div className="update-modal-header">
      <h2 className="update-modal-title">Update Complaint</h2>
      <button onClick={onClose} className="update-modal-close-btn">
        &times;
      </button>
    </div>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="update-modal-label">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="update-modal-input"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="update-modal-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="update-modal-textarea"
          rows="4"
        />
      </div>
      <div className="update-modal-btn-group">
        <button
          type="button"
          onClick={onClose}
          className="update-modal-cancel-btn"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="update-modal-save-btn"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default UpdateModal;