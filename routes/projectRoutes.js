import express from 'express';
import {
    getProjectController,
    getAllProjectsController,
    getMyProjectsController,
    createProjectController,
    updateProjectController,
    deleteProjectController
} from '../controllers/projectController.js';

const router = express.Router();


router.get('/all', getAllProjectsController);
router.get('/my', getMyProjectsController);
router.get('/:projectId', getProjectController);
router.post('/create', createProjectController);
router.put('/update/:projectId', updateProjectController);
router.delete('/del/:projectId', deleteProjectController);

export default router;