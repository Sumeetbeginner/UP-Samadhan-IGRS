

# 📘 Complaints API Documentation

**Base URL:** `http://localhost:3000/api/complaints`

## 📌 Common Headers

```http
Content-Type: application/json
```

---

## 📍 GET `/api/complaints`

### Description:
Fetch all complaints from the database.

### Response:
```json
[
  {
    "_id": "123abc",
    "category": "Sanitation",
    "description": "Garbage not collected in area",
    "location": "Sector 12",
    "status": "Pending"
  },
  ...
]
```

---

## 📍 GET `/api/complaints/:id`

### Description:
Fetch a single complaint by its ID.

### Params:
- `id`: `string` (Complaint MongoDB ObjectId)

### Response:
```json
{
  "_id": "123abc",
  "category": "Water Supply",
  "description": "Leakage in main pipeline",
  "location": "Sector 8",
  "status": "Resolved"
}
```

---

## 📍 POST `/api/complaints`

### Description:
Create a new complaint.

### Request Body:
```json
{
  "category": "Road Maintenance",
  "description": "Potholes in main road",
  "location": "Sector 5",
  "status": "Pending" // Optional, defaults to 'Pending'
}
```

### Response (201 Created):
```json
{
  "_id": "newId",
  "category": "Road Maintenance",
  "description": "Potholes in main road",
  "location": "Sector 5",
  "status": "Pending"
}
```

---

## 📍 PATCH `/api/complaints/:id`

### Description:
Update one or more fields of a complaint.

### Params:
- `id`: `string` (Complaint ID)

### Request Body (any subset of):
```json
{
  "status": "Resolved",
  "description": "Updated issue details"
}
```

### Response:
```json
{
  "_id": "123abc",
  "category": "Water Supply",
  "description": "Updated issue details",
  "location": "Sector 8",
  "status": "Resolved"
}
```

---

## 📍 DELETE `/api/complaints/:id`

### Description:
Delete a complaint by its ID.

### Response:
```json
{
  "message": "Complaint deleted"
}
```

---

## ❌ Error Handling

### Common Responses:
- `400 Bad Request` – Invalid input
- `404 Not Found` – Complaint does not exist
- `500 Internal Server Error` – Server-side failure

---
