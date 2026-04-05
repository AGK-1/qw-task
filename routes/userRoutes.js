import express from 'express';
import {
    getUsersController,
    getUserController,
    createUserController,
    updateUserController,
    deleteUserController
} from '../controllers/userController.js';  // ✅ с .js

const router = express.Router();


router.get('/', getUsersController);
router.get('/:id', getUserController);
router.post('/register', createUserController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;