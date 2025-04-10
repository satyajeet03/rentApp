import express from 'express';
import { addInterest, checkInterest, getUserInterests, removeInterest } from '../controllers/interestController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/add', auth, addInterest);
router.get('/', auth, getUserInterests);
router.delete('/:propertyId', auth, removeInterest);
router.post('/remove', removeInterest);
// routes/interestRoutes.ts
router.get('/check/:propertyId', auth, checkInterest);
export default router;
