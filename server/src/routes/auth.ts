import express from 'express';
import { register, login } from '../controllers/authController';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

export default router; 