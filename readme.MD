
# UP Samadhan (UP Govt - IGRS)

This project is an enhancement of the IGRS (UP Samadhan) complaint management system. It uses a Vision Transformer model to extract features from complaint images and a custom classifier to categorize and prioritize grievances automatically. The system improves routing efficiency, reduces manual review time, and ensures timely redressal of public complaints.

---

## Prerequisites

- Node.js & npm
- Python 3.8+
- MongoDB (Cloud URI used)
- Git

---

## Environment Variables

Create a `.env` file inside `dbserver/` with the following:

```env
MONGODB_URI=
PORT=3000
```

---

## Backend Setup (Node.js)

```bash
cd dbserver
npm install
npm install -g nodemon
nodemon index.js
```

---

## ML API Setup (Python)

```bash
cd mlapi
python -m venv env
On Windows: env\Scripts\activate  # source env/bin/activate 
pip install -r requirements.txt
python app.py
```

---

## Frontend Setup (Client)

```bash
cd client
npm install
npm run dev
```

## Frontend Setup (Admin)

```bash
cd admin
npm install
npm run dev
```

---

## Notes

- The `temp_uploads/` directory is used for temporary files and can be added to `.gitignore`.
- Ensure all `.env` files are not tracked in Git for security reasons.
- The app runs on `localhost:3000` (Node.js) and ML API likely on `localhost:5000` (Flask default) unless changed.

---

## API Documentation

- Node API: [dbserver/apidocs.md](./dbserver/apidocs.md)
- ML API: [mlapi/api.md](./mlapi/api.md)

---

## License

MIT License
