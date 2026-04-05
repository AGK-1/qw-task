import { initDB } from '../tmp/db.js';

// Получить всех пользователей
export async function getAllUsers() {
    const db = await initDB();
    return db.all('SELECT * FROM users');
}

// Получить одного пользователя по ID
export async function getUser(id) {
    const db = await initDB();
    return db.get('SELECT * FROM users WHERE id = ?', [id]);
}

// Создать пользователя
export async function createUser(name, email, password) {
    const db = await initDB();
    const result = await db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
    );
    return { id: result.lastID, name, email };
}

// Обновить пользователя
export async function updateUser(id, name, email, password) {
    const db = await initDB();
    await db.run(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        [name, email, password, id]
    );
    return { id, name, email };
}

// Удалить пользователя
export async function deleteUser(id) {
    const db = await initDB();
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    return "User deleted";
}

// ✅ Последний export { ... } НЕ НУЖЕН