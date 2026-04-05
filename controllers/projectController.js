import {
    getAllProjects as getAllProjectsModel,
    getMyProjects as getMyProjectsModel,
    createProject,
    updateProject as updateProjectModel,
    deleteProject as deleteProjectModel,
    getProject as getOneProjectId
} from '../models/projectModel.js';


// Get project with ID
export async function getProjectController(req, res) {
    try {
        const projectId = req.params.projectId; // берём из URL
        const project = await getOneProjectId(projectId); // вызываем модель

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        res.json(project); // возвращаем JSON
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET /projects
export async function getAllProjectsController(req, res) {
    try {
        const projects = await getAllProjectsModel();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET /projects/my/
export async function getMyProjectsController(req, res) {
    try {
        const userId = req.session.userId;
        const projects = await getMyProjectsModel(userId);

        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /projects
export async function createProjectController(req, res) {
    try {
        const { name, description } = req.body;
        const userId = req.session.userId; // ✅ берем из session

        const project = await createProject(name, description, userId);
        res.redirect("/projects");
        // res.status(201).json(project);
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
        const projectId = Number(req.params.projectId);
        const userId = req.session.userId;

        // console.log("projectId:", projectId);
        // console.log("userId:", userId);

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!projectId) {
            return res.status(400).json({ error: "Invalid projectId" });
        }

        const success = await deleteProjectModel(userId, projectId);

        if (!success) {
            return res.status(403).json({
                error: "Project not found or no permission"
            });
        }

        return res.json({ message: "Project deleted!" });

    } catch (err) {
        console.error("DELETE ERROR:", err); // 👈 увидишь причину
        return res.status(500).json({ error: err.message });
    }
}

export default {
    createProjectController,
    getAllProjectsController,
    getMyProjectsController,
    deleteProjectController,
    updateProjectController
};