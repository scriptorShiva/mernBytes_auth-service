import express from 'express';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();
const authController = new AuthController();

router.post('/register', authController.register);
// used this way when any binding issue occurs
// router.post('/register', (req, res) => authController.register(req, res));

export default router;
