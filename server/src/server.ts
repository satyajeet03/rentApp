import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import propertyRoutes from './routes/property';
import bodyParser from "body-parser";
// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
// Increase payload size limit (example: 10mb)
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
import { Request, Response, NextFunction } from 'express';
// Routes
app.use('/auth', authRoutes);
app.use('/properties', propertyRoutes);

import multer from 'multer';
import { uploadImagesToCloudinary } from './utils/uploadImages';
import { auth, AuthRequest } from './middleware/auth';
import interestRoutes from './routes/interestRoutes';
// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only image files are allowed!'));
    }
  }
});
// const upload = multer({ dest: 'uploads/' }); // you can use diskStorage if needed
const router = express.Router();
app.use('/interests', interestRoutes);
 

// server.ts
app.post('/upload-images', auth, upload.array('images'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Debug logging
    console.log('Received files:', req.files);
    
    if (!req.files || !Array.isArray(req.files)) {
      console.log('No files received or invalid format');
      return res.status(400).json({ message: 'No files uploaded or invalid format' });
    }

    const urls = await uploadImagesToCloudinary(req.files, req.user?.id || "opopo");
    
    console.log('Uploaded URLs:', urls);
    res.json({ urls });
  } catch (error) {
    console.error("Error while uploading files", error);
    res.status(500).json({ 
      message: 'Image upload failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});
// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
app.use((req, res, next) => {
  let size = 0;
  req.on('data', chunk => {
    size += chunk.length;
  });
  req.on('end', () => {
    console.log(`Request size: ${(size / 1024 / 1024).toFixed(2)} MB`);
  });
  next();
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 