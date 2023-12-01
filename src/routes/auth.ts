import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService); // this passing of userService is our dependency injection : receive dependencies from constructor function

// router.post('/register', authController.register);
// used this way when any binding issue occurs
router.post('/register', (req, res) => authController.register(req, res));

export default router;
