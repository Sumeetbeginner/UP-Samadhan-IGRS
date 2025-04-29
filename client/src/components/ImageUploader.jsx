import { useState, useCallback } from 'react';

const ImageUploader = ({ onImageUpload, onImageUrlSubmit }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    onImageUpload(file);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      processImage(file);
    }
  }, []);

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const url = e.target.elements.imageUrl.value;
    if (url) {
      setPreview(url);
      onImageUrlSubmit(url);
    }
  };

  return (
    <div className="card">
      <div className="card-header">Upload Complaint Image</div>
      <div className="card-body">
        <div 
          className={`image-upload-container ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label htmlFor="image-upload" className="btn btn-primary mb-4">
            Choose File
          </label>
          <p className="text-gray-500 mb-4">or drag and drop image here</p>
          
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <input
              type="text"
              name="imageUrl"
              className="form-control flex-1"
              placeholder="Enter image URL"
            />
            <button type="submit" className="btn btn-outline">
              Use URL
            </button>
          </form>
        </div>
        
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Preview" className="image-preview w-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;