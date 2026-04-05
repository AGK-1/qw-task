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
router.get('/cur', getUserController); // мы берём userId из сессии, id в URL не нужен
router.post('/register', createUserController);
router.post('/update', updateUserController);
router.delete('/delete', deleteUserController);

export default router;