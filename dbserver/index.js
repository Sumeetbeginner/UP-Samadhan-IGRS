import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import Complaint from './models/complaint.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// app.post('/api/complaints', async (req, res) => {
//   const complaint = new Complaint({
//     category: req.body.category,
//     description: req.body.description,
//     location: req.body.location,
//     status: req.body.status || 'Pending' // Default status
//   });

//   try {
//     const newComplaint = await complaint.save();
//     res.status(201).json(newComplaint);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// const nodemailer = require('nodemailer');

app.post('/api/complaints', async (req, res) => {
  const complaint = new Complaint({
    category: req.body.category,
    description: req.body.description,
    location: req.body.location,
    status: req.body.status || 'Pending'
  });

  try {
    const newComplaint = await complaint.save();

    // Send HTML email after saving the complaint
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'creata3690@gmail.com', // replace with your Gmail
        pass: 'duza tisv uuol pyuc'    // use App Password, not your actual Gmail password
      }
    });

    const mailOptions = {
      from: '"IGRS Support" <creata3690@gmail.com>',
      to: 'sumeetgupta3690@gmail.com',
      subject: 'Thank You for Submitting Your Complaint - IGRS',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2E86C1;">Thank You for Submitting Your Complaint</h2>
          <p style="font-size: 16px;">Dear User,</p>
          <p>We have received your complaint. Our team at <strong>IGRS</strong> will look into the matter and resolve it as soon as possible.</p>
          <h3 style="color: #117A65;">Complaint Details:</h3>
          <ul style="font-size: 15px;">
            <li><strong>Category:</strong> ${newComplaint.category}</li>
            <li><strong>Description:</strong> ${newComplaint.description}</li>
            <li><strong>Location:</strong> ${newComplaint.location}</li>
            <li><strong>Status:</strong> ${newComplaint.status}</li>
          </ul>
          <p style="margin-top: 20px;">Thank you for helping us improve our services.</p>
          <p style="color: #888; font-size: 14px;">- IGRS Support Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.get('/api/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// app.patch('/api/complaints/:id', async (req, res) => {
//   try {
//     const complaint = await Complaint.findById(req.params.id);
//     if (!complaint) {
//       return res.status(404).json({ message: 'Complaint not found' });
//     }

//     if (req.body.category != null) {
//       complaint.category = req.body.category;
//     }
//     if (req.body.description != null) {
//       complaint.description = req.body.description;
//     }
//     if (req.body.status != null) {
//       complaint.status = req.body.status;
//     }
//     if (req.body.location != null) {
//       complaint.location = req.body.location;
//     }

//     const updatedComplaint = await complaint.save();
//     res.json(updatedComplaint);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'pending':
      return '#F39C12'; // Orange
    case 'in progress':
      return '#3498DB'; // Blue
    case 'resolved':
      return '#27AE60'; // Green
    case 'rejected':
      return '#E74C3C'; // Red
    default:
      return '#7F8C8D'; // Grey
  }
}

app.patch('/api/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    let statusChanged = false;

    if (req.body.category != null) {
      complaint.category = req.body.category;
    }
    if (req.body.description != null) {
      complaint.description = req.body.description;
    }
    if (req.body.status != null && req.body.status !== complaint.status) {
      statusChanged = true;
      complaint.status = req.body.status;
    }
    if (req.body.location != null) {
      complaint.location = req.body.location;
    }

    const updatedComplaint = await complaint.save();

    // Send status update email if status was changed
    if (statusChanged) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'creata3690@gmail.com',       // replace with your Gmail
          pass: 'duza tisv uuol pyuc'          // use App Password
        }
      });

      const mailOptions = {
        from: '"IGRS Support" <yourgmail@gmail.com>',
        to: 'sumeetgupta3690@gmail.com',
        subject: 'Complaint Status Updated - IGRS',
        html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    <h2 style="color: #28B463;">Complaint Status Updated</h2>
    <p style="font-size: 16px;">Dear User,</p>
    <p>Your complaint's status has been updated by our team. Please find the updated details below:</p>
    <h3 style="color: #117A65;">Updated Complaint Details:</h3>
    <ul style="font-size: 15px;">
      <li><strong>Category:</strong> ${updatedComplaint.category}</li>
      <li><strong>Description:</strong> ${updatedComplaint.description}</li>
      <li><strong>Location:</strong> ${updatedComplaint.location}</li>
      <li>
        <strong>New Status:</strong>
        <span style="color: ${getStatusColor(updatedComplaint.status)}; font-weight: bold;">
          ${updatedComplaint.status}
        </span>
      </li>
    </ul>
    <p style="margin-top: 20px;">Thank you for your patience.</p>
    <p style="color: #888; font-size: 14px;">- IGRS Support Team</p>
  </div>
`

      };

      await transporter.sendMail(mailOptions);
    }

    res.json(updatedComplaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});