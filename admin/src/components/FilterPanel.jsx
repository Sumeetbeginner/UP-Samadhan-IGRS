import '../styles/main.css';

const FilterPanel = ({ filters, onFilterChange }) => {
  return (
<div className="filter-container">
  <h3 className="filter-title">Filter Complaints</h3>
  <div className="filter-grid">
    <div className="filter-group">
      <label className="filter-label">Status</label>
      <select
        name="status"
        value={filters.status}
        onChange={onFilterChange}
        className="filter-select"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
      </select>
    </div>
    <div className="filter-group">
      <label className="filter-label">Category</label>
      <select
        name="category"
        value={filters.category}
        onChange={onFilterChange}
        className="filter-select"
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
    <div className="filter-group">
      <label className="filter-label">Location</label>
      <input
        type="text"
        name="location"
        value={filters.location}
        onChange={onFilterChange}
        placeholder="Search location..."
        className="filter-input"
      />
    </div>
  </div>
</div>
  );
};

export default FilterPanel;