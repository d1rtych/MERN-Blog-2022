import { Router } from 'express';

import { getMe, login, signUp } from '../controllers/auth.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = new Router();

// Sign Up
router.post('/signup', signUp);

// Login
router.post('/login', login);

// Get Me
router.get('/me', verifyToken, getMe);

export default router;
