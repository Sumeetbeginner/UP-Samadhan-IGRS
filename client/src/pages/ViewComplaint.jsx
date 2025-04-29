import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ComplaintForm from '../components/ComplaintForm';

const ViewComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/complaints/${id}`);
        setComplaint(response.data);
      } catch (err) {
        setError('Failed to fetch complaint details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await axios.patch(`http://localhost:3000/api/complaints/${id}`, formData);
      navigate('/', { state: { success: 'Complaint updated successfully!' } });
    } catch (error) {
      console.error('Error updating complaint:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await axios.delete(`http://localhost:3000/api/complaints/${id}`);
        navigate('/', { state: { success: 'Complaint deleted successfully!' } });
      } catch (error) {
        console.error('Error deleting complaint:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-6 flex justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-6">
        <div className="alert alert-danger">{error}</div>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary mt-4"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Complaint Details</h1>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-outline"
        >
          Back to Dashboard
        </button>
      </div>
      
      {complaint && (
        <>
          <ComplaintForm 
            onSubmit={handleUpdate} 
            initialData={complaint} 
          />
          <div className="flex justify-end mt-4">
            <button 
              onClick={handleDelete} 
              className="btn btn-danger"
            >
              Delete Complaint
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewComplaint;