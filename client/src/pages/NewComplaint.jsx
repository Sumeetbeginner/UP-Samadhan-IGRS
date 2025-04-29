import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import ComplaintForm from '../components/ComplaintForm';

const NewComplaint = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await axios.post('http://localhost:3000/api/complaints', formData);
      navigate('/', { state: { success: 'Complaint submitted successfully!' } });
    } catch (error) {
      console.error('Error submitting complaint:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">File New Complaint</h1>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-outline"
        >
          Back to Dashboard
        </button>
      </div>
      
      <ComplaintForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewComplaint;