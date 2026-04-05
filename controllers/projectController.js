import {
    getAllProjects as getAllProjectsModel,
    getMyProjects as getMyProjectsModel,
    createProject,
    updateProject as updateProjectModel,
    deleteProject as deleteProjectModel
} from '../models/projectModel.js';

// GET /projects
export async function getAllProjectsController(req, res) {
    try {
        const projects = await getAllProjectsModel();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET /projects/my/:userId
export async function getMyProjectsController(req, res) {
    try {
        const userId = req.params.userId;
        const projects = await getMyProjectsModel(userId);
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /projects
export async function createProjectController(req, res) {
    try {
        const { name, description, userId } = req.body;
        const project = await createProject(name, description, userId);
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// PUT /projects/:projectId
export async function updateProjectController(req, res) {
    try {
        const { projectId } = req.params;
        const { name, description, userId } = req.body;

        const result = await updateProjectModel(projectId, name, description, userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// DELETE /projects/:projectId
export async function deleteProjectController(req, res) {
    try {
        const { projectId } = req.params;
        const { userId } = req.body;

        const result = await deleteProjectModel(userId, projectId);
        res.json({ message: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export default {
    createProjectController,
    getAllProjectsController,
    getMyProjectsController,
    deleteProjectController,
    updateProjectController
};