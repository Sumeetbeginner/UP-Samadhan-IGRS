# Flask API Documentation

## Base URL
`http://localhost:5000`

## Endpoints

### 1. Predict and Describe Image

**Endpoint**: `POST /predictAndDescribeImage`

#### Description
Analyzes an image to predict relevant categories and generates a textual description.

#### Request
Two options:
1. **File Upload** (form-data):
   - Key: `image`
   - Value: Image file (jpg, png, etc.)

2. **Image URL** (JSON):
   ```json
   {
     "image_url": "https://example.com/image.jpg"
   }
   ```

#### Example Request (Postman)
- **Method**: POST
- **Headers**:
  - `Content-Type`: multipart/form-data (for file upload)
  - or `Content-Type`: application/json (for URL)
- **Body**:
  - form-data: Select "File" and choose an image
  - or raw JSON:
    ```json
    {
      "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRIq0Hs4uBJKB0R86sveRcJ2FrmqE2jRAFjw&s"
    }
    ```

#### Example Response
```json
{
  "success": true,
  "predictions": [
    {"category": "Fighting", "probability": 5.23},
    {"category": "Uncleanliness", "probability": 12.45},
    {"category": "Accident", "probability": 3.21},
    {"category": "Traffic Jam", "probability": 7.89},
    {"category": "Missing Document", "probability": 1.23},
    {"category": "Power Outage", "probability": 2.34},
    {"category": "Water Supply Issue", "probability": 4.56},
    {"category": "Illegal Construction", "probability": 8.76},
    {"category": "Corruption Complaint", "probability": 1.98},
    {"category": "Garbage Dump", "probability": 25.43},
    {"category": "Noise Pollution", "probability": 3.45},
    {"category": "Public Harassment", "probability": 2.34},
    {"category": "Stray Animals", "probability": 6.54},
    {"category": "Street Light", "probability": 3.21},
    {"category": "Road Damage/Potholes", "probability": 15.67},
    {"category": "Tree Fallen", "probability": 1.23},
    {"category": "Documents", "probability": 0.98}
  ],
  "top_prediction": {
    "category": "Garbage Dump",
    "probability": 25.43
  },
  "description": "The image shows a pile of garbage bags on a city street with some scattered waste around them."
}
```

---

### 2. Classify Text Complaint

**Endpoint**: `POST /classifyTextComplaint`

#### Description
Classifies a text complaint into one of predefined categories.

#### Request
```json
{
  "text": "There's garbage piling up on Main Street for days now."
}
```

#### Example Request (Postman)
- **Method**: POST
- **Headers**:
  - `Content-Type`: application/json
- **Body** (raw JSON):
  ```json
  {
    "text": "There's garbage piling up on Main Street for days now."
  }
  ```

#### Example Response
```json
{
  "success": true,
  "classification": "Garbage Dump"
}
```

#### Test Cases
| Input Text | Expected Output |
|------------|-----------------|
| "Loud music playing all night from the club nearby" | "Noise Pollution" |
| "Potholes on Elm Street causing accidents" | "Road Damage/Potholes" |
| "No electricity in our area since morning" | "Power Outage" |
| "Construction happening without proper permits" | "Illegal Construction" |

---

### 3. OCR Processing

**Endpoint**: `POST /ocr`

#### Description
Extracts text from an image, detects document type, and extracts relevant fields.

#### Request
Two options:
1. **File Upload** (form-data):
   - Key: `image`
   - Value: Image file (jpg, png, etc.)

2. **Image URL** (JSON):
   ```json
   {
     "image_url": "https://example.com/document.jpg"
   }
   ```

#### Example Request (Postman)
- **Method**: POST
- **Headers**:
  - `Content-Type`: multipart/form-data (for file upload)
  - or `Content-Type`: application/json (for URL)
- **Body**:
  - form-data: Select "File" and choose a document image
  - or raw JSON:
    ```json
    {
      "image_url": "https://example.com/electricity-bill.jpg"
    }
    ```

#### Example Responses

**Electricity Bill:**
```json
{
  "success": true,
  "document_type": "electricity_bill",
  "extracted_text": "ELECTRICITY BILL Account No: 12345678 Name: John Doe Period: Jan 2023 Total Amount: ₹1,250.00 Due Date: 15-Feb-2023",
  "extracted_fields": {
    "amount": "1250.00",
    "consumer_number": "12345678"
  }
}
```

**FIR Document:**
```json
{
  "success": true,
  "document_type": "fir",
  "extracted_text": "FIR No: 123/2023 Police Station: Central Date: 12/01/2023 Complainant: Jane Smith",
  "extracted_fields": {
    "fir_number": "123/2023",
    "date": "12/01/2023"
  }
}
```

**Identity Document:**
```json
{
  "success": true,
  "document_type": "identity",
  "extracted_text": "PAN Card Name: RAJESH KUMAR DOB: 15/08/1985 PAN: ABCDE1234F",
  "extracted_fields": {
    "id_number": "ABCDE1234F",
    "name": "RAJESH KUMAR"
  }
}
```

#### Test Cases
| Document Type | Expected Fields |
|--------------|----------------|
| Electricity Bill | amount, consumer_number |
| FIR | fir_number, date |
| PAN Card | id_number, name |
| Receipt | amount, date |

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Error message"
}
```

Common error scenarios:
- `400 Bad Request`: Missing required parameters
- `500 Internal Server Error`: Processing failed
- `415 Unsupported Media Type`: Invalid file type

---

## Postman Collection

You can import this collection to test all endpoints:

```json
{
  "info": {
    "_postman_id": "a1b2c3d4-e5f6-7890",
    "name": "Flask Image Processing API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Predict and Describe Image",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "image",
              "type": "file",
              "src": "/path/to/image.jpg"
            }
          ]
        },
        "url": {
          "raw": "http://localhost:5000/predictAndDescribeImage",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["predictAndDescribeImage"]
        }
      }
    },
    {
      "name": "Classify Text Complaint",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"text\": \"There's garbage piling up on Main Street for days now.\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "http://localhost:5000/classifyTextComplaint",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["classifyTextComplaint"]
        }
      }
    },
    {
      "name": "OCR Processing",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "image",
              "type": "file",
              "src": "/path/to/document.jpg"
            }
          ]
        },
        "url": {
          "raw": "http://localhost:5000/ocr",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["ocr"]
        }
      }
    }
  ]
}
```