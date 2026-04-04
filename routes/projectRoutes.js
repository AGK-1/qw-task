import express from 'express';
import {
    getAllProjectsController,
    getMyProjectsController,
    createProjectController,
    updateProjectController,
    deleteProjectController
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/projects', getAllProjectsController);
router.get('/projects/my/:userId', getMyProjectsController);
router.post('/projects', createProjectController);
router.put('/projects/:projectId', updateProjectController);
router.delete('/projects/:projectId', deleteProjectController);

export default router;