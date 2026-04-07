import { initDB } from '../tmp/db.js';


////Get one project with id
export async function getProject(id) {
    const db = await initDB();
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [id]);
    return project; // undefined, если нет проекта
}

///get project with user name
export async function getAllProjectsWithUserName() {
    const db = await initDB();
    const projects = await db.all(`
        SELECT projects.*, users.name AS user_name
        FROM projects
        JOIN users ON projects.user_id = users.id
    `);
    return projects; // return projects with users name 
}

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

// export async function updateProject(projectId, name, description, myId) {
//     const db = await initDB();
//     const result = await db.run(
//         'UPDATE projects SET name = ?, description = ? WHERE id = ? AND user_id = ?',
//         [name, description, projectId, myId]
//     );

//     if (result.changes === 0) {
//         return "Project not found or you don't have permission!";
//     }

//     return { id: projectId, name, description };
// }

export async function updateProject(projectId, data, myId) {
    const db = await initDB();

    const fields = [];
    const values = [];

    if (data.name !== undefined) {
        fields.push("name = ?");
        values.push(data.name);
    }
    if (data.description !== undefined) {
        fields.push("description = ?");
        values.push(data.description);
    }

    if (fields.length === 0) return false; // нечего обновлять

    values.push(projectId, myId); // для WHERE

    const sql = `UPDATE projects SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`;
    const result = await db.run(sql, values);

    return result.changes > 0;
}


export async function deleteProject(myId, projectId) {
    const db = await initDB();

    const result = await db.run(
        'DELETE FROM projects WHERE id = ? AND user_id = ?',
        [projectId, myId]
    );

    return result.changes > 0;
}


