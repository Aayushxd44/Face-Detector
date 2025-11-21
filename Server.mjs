// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const PORT = 5000;

// // Enable CORS for all routes
// app.use(cors());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Set up multer for file storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Append extension
//   }
// });

// const upload = multer({ storage });

// // POST route to handle image uploads
// app.post('/upload', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     console.error('No file uploaded.');
//     return res.status(400).json({ error: 'No file uploaded.' });
//   }

//   console.log('Received file:', req.file);

//   const fileUrl = `http://localhost:${PORT}/${req.file.filename}`;
//   res.status(200).json({ fileName: req.file.filename, filePath: fileUrl });
// });


// // Create uploads directory if it does not exist
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = 5000;

// ESM way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '/Face Detector/FaceDetector/uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.error('No file uploaded.');
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.status(200).json({ fileName: req.file.filename, filePath: fileUrl });
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
