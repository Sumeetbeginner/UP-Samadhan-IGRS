import '../styles/main.css';

const StatusFilter = ({ currentFilter, onFilterChange }) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
  ];

  return (
    <div className="status-filter">
      <h3 className="filter-title">Filter by Status</h3>
      <div className="filter-options">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            className={`filter-button ${currentFilter === option.value ? 'active' : ''}`}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;