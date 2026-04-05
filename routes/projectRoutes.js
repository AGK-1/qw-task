import express from 'express';
import {
    getAllProjectsController,
    getMyProjectsController,
    createProjectController,
    updateProjectController,
    deleteProjectController
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/all', getAllProjectsController);
router.get('/my/:userId', getMyProjectsController);
router.post('/create', createProjectController);
router.put('/update/:projectId', updateProjectController);
router.delete('/del/:projectId', deleteProjectController);

export default router;