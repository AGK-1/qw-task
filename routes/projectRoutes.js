import express from 'express';
import {
    getAllProjects,
    getMyProjects,
    createProject,
    updateProject,
    deleteProject
} from '../models/projectModel.js';

const router = express.Router();

// get all routes
router.get('/projects', async (req, res) => {
    const projects = await getAllProjects();
    res.json(projects);
});

// Получить мои проекты (например, myId из query или токена)
router.get('/projects/my/:userId', async (req, res) => {
    const userId = req.params.userId;
    const projects = await getMyProjects(userId);
    res.json(projects);
});

// Создать новый проект
router.post('/projects', async (req, res) => {
    const { name, description, userId } = req.body;
    const project = await createProject(name, description, userId);
    res.status(201).json(project);
});

// Обновить проект
router.put('/projects/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const { name, description, userId } = req.body;
    const result = await updateProject(projectId, name, description, userId);
    res.json(result);
});

// Удалить проект
router.delete('/projects/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const { userId } = req.body; // или из токена
    const result = await deleteProject(userId, projectId);
    res.json({ message: result });
});

export default router;