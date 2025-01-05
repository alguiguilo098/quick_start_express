import express from 'express';

import { checkLogin, handleAuth, logout } from '../controller/authController.js';
import { errorHandlerWrapper } from '../errorHandler/errorHandler.js';

const router = express.Router();

// token is verified if exists otherwise redirects to google auth
router.get('/login', errorHandlerWrapper(checkLogin, 'controller/authController'));

// handles Google callback
router.get('/google/redirect', errorHandlerWrapper(handleAuth, 'controller/authController'));

// handles logout
router.get('/logout', errorHandlerWrapper(logout, 'controller/authController'));

export { router as authRouter };
