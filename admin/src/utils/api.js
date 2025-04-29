const BASE_URL = 'http://localhost:3000/api/complaints';

const mockComplaints = [
    {
      _id: "1",
      category: "Sanitation",
      description: "Garbage not collected for 5 days in Block C",
      location: "Sector 12",
      status: "Pending",
      createdAt: "2023-05-10T09:30:00Z"
    },
    {
      _id: "2",
      category: "Water Supply",
      description: "Severe leakage in main pipeline near community park",
      location: "Sector 8",
      status: "In Progress",
      createdAt: "2023-05-12T14:15:00Z"
    },
    {
      _id: "3",
      category: "Road Maintenance",
      description: "Large potholes causing traffic congestion on Main Street",
      location: "Sector 5",
      status: "Resolved",
      createdAt: "2023-04-28T11:20:00Z",
      resolvedAt: "2023-05-05T16:45:00Z"
    },
    {
      _id: "4",
      category: "Electricity",
      description: "Street lights not working in Lane 5 after 8 PM",
      location: "Sector 3",
      status: "Pending",
      createdAt: "2023-05-15T18:00:00Z"
    },
    {
      _id: "5",
      category: "Public Safety",
      description: "Broken railing on pedestrian bridge near school",
      location: "Sector 9",
      status: "In Progress",
      createdAt: "2023-05-08T10:45:00Z"
    },
    {
      _id: "6",
      category: "Parks & Recreation",
      description: "Playground equipment damaged in Central Park",
      location: "Sector 1",
      status: "Pending",
      createdAt: "2023-05-14T16:30:00Z"
    },
    {
      _id: "7",
      category: "Noise Pollution",
      description: "Construction noise beyond permitted hours",
      location: "Sector 7",
      status: "Resolved",
      createdAt: "2023-04-30T22:10:00Z",
      resolvedAt: "2023-05-03T12:00:00Z"
    },
    {
      _id: "8",
      category: "Water Supply",
      description: "Low water pressure in apartment complex",
      location: "Sector 11",
      status: "In Progress",
      createdAt: "2023-05-11T07:15:00Z"
    },
    {
      _id: "9",
      category: "Road Maintenance",
      description: "Missing manhole cover near market square",
      location: "Sector 4",
      status: "Pending",
      createdAt: "2023-05-16T09:00:00Z"
    },
    {
      _id: "10",
      category: "Sanitation",
      description: "Illegal dumping site near residential area",
      location: "Sector 6",
      status: "Resolved",
      createdAt: "2023-04-25T13:40:00Z",
      resolvedAt: "2023-05-02T10:20:00Z"
    }
  ];
  
  // Helper functions
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));
let nextId = mockComplaints.length + 1;
const generateId = () => (nextId++).toString();

const fetchWithFallback = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.warn('API request failed, using mock data:', error.message);
    return null; // Signal to use mock data
  }
};

// API functions with fallback to mock data
export const fetchComplaints = async (filters = {}) => {
  await simulateDelay();
  
  // Try real API first
  const apiData = await fetchWithFallback(BASE_URL);
  let results = apiData ? apiData : [...mockComplaints];
  
  // Apply filters
  if (filters.status) {
    results = results.filter(c => c.status === filters.status);
  }
  if (filters.category) {
    results = results.filter(c => c.category === filters.category);
  }
  if (filters.location) {
    results = results.filter(c => 
      c.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  return results;
};

export const fetchComplaintById = async (id) => {
  await simulateDelay();
  const apiData = await fetchWithFallback(`${BASE_URL}/${id}`);
  if (apiData) return apiData;
  
  return mockComplaints.find(complaint => complaint._id === id);
};

export const createComplaint = async (complaintData) => {
  await simulateDelay();
  
  // Try real API first
  const apiResponse = await fetchWithFallback(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(complaintData)
  });
  
  if (apiResponse) return apiResponse;
  
  // Fallback to mock
  const newComplaint = {
    _id: generateId(),
    ...complaintData,
    status: complaintData.status || 'Pending',
    createdAt: new Date().toISOString()
  };
  mockComplaints.unshift(newComplaint);
  return newComplaint;
};

export const updateComplaint = async (id, updateData) => {
  await simulateDelay();
  
  // Try real API first
  const apiResponse = await fetchWithFallback(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });
  
  if (apiResponse) return apiResponse;
  
  // Fallback to mock
  const index = mockComplaints.findIndex(c => c._id === id);
  if (index === -1) throw new Error('Complaint not found');
  
  const updatedComplaint = {
    ...mockComplaints[index],
    ...updateData,
    ...(updateData.status === 'Resolved' && !mockComplaints[index].resolvedAt 
      ? { resolvedAt: new Date().toISOString() } 
      : {})
  };
  
  mockComplaints[index] = updatedComplaint;
  return updatedComplaint;
};

export const deleteComplaint = async (id) => {
  await simulateDelay();
  
  // Try real API first
  const apiResponse = await fetchWithFallback(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  
  if (apiResponse) return apiResponse;
  
  // Fallback to mock
  const index = mockComplaints.findIndex(c => c._id === id);
  if (index === -1) throw new Error('Complaint not found');
  const [deleted] = mockComplaints.splice(index, 1);
  return { 
    message: "Complaint deleted",
    deletedComplaint: deleted
  };
};