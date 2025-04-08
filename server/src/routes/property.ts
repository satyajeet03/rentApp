import express from 'express';
import { 
  getAllProperties, 
  getOwnerProperties,
  getPropertyById, 
  createProperty, 
  updateProperty, 
  deleteProperty,
  searchProperties
} from '../controllers/propertyController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllProperties); // Get all properties (for tenants)
router.get('/search', searchProperties); // Search properties
router.get('/:id', getPropertyById); // Get property by ID

// Protected routes (require authentication)
router.get('/owner/properties', auth, getOwnerProperties); // Get owner's properties
router.post('/createProperties', auth, createProperty); // Create property (owners only)
router.put('/:id', auth, updateProperty); // Update property (owners only)
router.delete('/:id', auth, deleteProperty); // Delete property (owners only)

export default router; 