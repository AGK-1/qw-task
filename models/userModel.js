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

//update user
export async function updateUser(id, name, email, password) {
    const db = await initDB();
    const fields = [];
    const values = [];

    if (name) {
        fields.push('name = ?');
        values.push(name);
    }
    if (email) {
        fields.push('email = ?');
        values.push(email);
    }
    if (password) {
        fields.push('password = ?');
        values.push(password);
    }

    if (fields.length === 0) {
        return getUser(id); // ничего не обновляем, просто возвращаем пользователя
    }

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await db.run(sql, values);

    return getUser(id); // возвращаем актуальные данные
}

// Удалить пользователя
export async function deleteUser(id) {
    const db = await initDB();
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    return "User deleted";
}

// ✅ Последний export { ... } НЕ НУЖЕН