import { initDB } from '../db/db.js';

export async function getAllUsers() {
    const db = await initDB();
    return db.all('SELECT * FROM users');
}

export async function createUser(name, email, password) {
    const db = await initDB();

    const result = await db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
    );

    return { id: result.lastID, name, email };
}

export async function updateUser(id, name, email, password) {
    const db = await initDB();

    await db.run(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        [name, email, password, id]
    );

    return { id, name, email };
}

export async function deleteUser(id, name, email, password) {
    const db = await initDB();

    await db.run(
        'DELETE FROM users WHERE id = ?',
        [name, email, password, id]
    );
    return "User deleted";
}

export { createUser, updateUser, getAllUsers,  deleteUser};