import { initDB } from '../tmp/db.js';

///// Get all projects
export async function getAllProjects() {
    const db = await initDB();
    return db.all('SELECT * FROM projects');
}

export async function getMyProjects(myId) {
    const db = await initDB();
    return db.all('SELECT * FROM projects WHERE user_id = ?', [myId]);
}

export async function createProject(name, description, myId) {
    const db = await initDB();
    const result = await db.run(
        'INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)',
        [name, description, myId]
    );

    return { id: result.lastID, name, description, user_id: myId };
}

export async function updateProject(projectId, name, description, myId) {
    const db = await initDB();
    const result = await db.run(
        'UPDATE projects SET name = ?, description = ? WHERE id = ? AND user_id = ?',
        [name, description, projectId, myId]
    );

    if (result.changes === 0) {
        return "Project not found or you don't have permission!";
    }

    return { id: projectId, name, description };
}

export async function deleteProject(myId, projectId) {
    const db = await initDB();
    const result = await db.run(
        'DELETE FROM projects WHERE id = ? AND user_id = ?',
        [projectId, myId]
    );

    if (result.changes === 0) {
        return "Project not found or you don't have permission!";
    }

    return "Project deleted!";
}
