import { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUploader from './ImageUploader';

const ComplaintForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    category: initialData.category || '',
    description: initialData.description || '',
    location: initialData.location || '',
    status: initialData.status || 'Pending',
    imageAnalysis: initialData.imageAnalysis || null,
    textAnalysis: initialData.textAnalysis || null
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const analyzeImage = async (imageData) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      let response;
      if (imageData instanceof File) {
        const formData = new FormData();
        formData.append('image', imageData);
        response = await axios.post('http://localhost:5000/predictAndDescribeImage', formData);
      } else {
        response = await axios.post('http://localhost:5000/predictAndDescribeImage', {
          image_url: imageData
        });
      }
      
      setFormData(prev => ({
        ...prev,
        category: response.data.top_prediction.category,
        description: response.data.description || prev.description,
        imageAnalysis: response.data
      }));
      setSuccess('Image analyzed successfully!');
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeText = async () => {
    if (!formData.description) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/classifyTextComplaint', {
        text: formData.description
      });
      
      setFormData(prev => ({
        ...prev,
        category: response.data.classification,
        textAnalysis: response.data
      }));
      setSuccess('Text analyzed successfully!');
    } catch (err) {
      setError('Failed to analyze text. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="card">
      <div className="card-header">
        {initialData._id ? 'Update Complaint' : 'File New Complaint'}
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <ImageUploader 
          onImageUpload={analyzeImage} 
          onImageUrlSubmit={analyzeImage} 
        />
        
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
            <option value="Fighting">Fighting</option>
            <option value="Uncleanliness">Uncleanliness</option>
            <option value="Accident">Accident</option>
            <option value="Traffic Jam">Traffic Jam</option>
            <option value="Missing Document">Missing Document</option>
            <option value="Power Outage">Power Outage</option>
            <option value="Water Supply Issue">Water Supply Issue</option>
            <option value="Illegal Construction">Illegal Construction</option>
            <option value="Corruption Complaint">Corruption Complaint</option>
            <option value="Garbage Dump">Garbage Dump</option>
            <option value="Noise Pollution">Noise Pollution</option>
            <option value="Public Harassment">Public Harassment</option>
            <option value="Stray Animals">Stray Animals</option>
            <option value="Street Light">Street Light</option>
            <option value="Road Damage/Potholes">Road Damage/Potholes</option>
            <option value="Tree Fallen">Tree Fallen</option>
            <option value="Documents">Documents</option>
          </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your complaint in detail..."
            />
            <button 
              type="button" 
              className="btn btn-secondary mt-2"
              onClick={analyzeText}
              disabled={!formData.description || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <span className="spinner mr-2"></span>
                  Analyzing...
                </>
              ) : 'Analyze Text'}
            </button>
          </div>
          
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Enter location details"
            />
          </div>
          
          {initialData._id && (
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-6">
            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={isAnalyzing}
            >
              {initialData._id ? 'Update Complaint' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;