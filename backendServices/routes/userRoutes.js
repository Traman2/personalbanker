import express from 'express'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js';
import {
    getAllUsers,
    getUserByUsername,
    createUser,
    getUserByToken
} from '../controllers/userController.js'

const router = express.Router();

//GET all users (only admin can do this)
router.get('/', auth, admin, getAllUsers);

//GET user by token
router.get('/me', auth, getUserByToken)

//GET user by Username
router.get('/:userName', getUserByUsername);

//POST user
router.post('/', createUser);

export default router;