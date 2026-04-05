import bcrypt from 'bcrypt';
import {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} from '../models/userModel.js';

// GET /users
export async function getUsersController(req, res) {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET /users/:id
export async function getUserController(req, res) {
    try {
        const id = req.session.userId; // ✅ просто берём из сессии
        const user = await getUser(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user); // ✅ возвращаем JSON
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /users (register)
export async function createUserController(req, res) {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser(name, email, hashedPassword);

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// PUT /users/:id
export async function updateUserController(req, res) {
    try {
        const userId = req.session.userId;
        const { name, email, password, currentPassword } = req.body;

        // получаем пользователя из базы
        const userCur = await getUser(userId);
        if (!userCur) return res.status(404).json({ error: "User not found" });

        let hashedPassword;

        if (password && password.trim() !== '') {
            if (!currentPassword || currentPassword.trim() === '') {
                return res.status(400).json({ error: "Current password required" });
            }

            // проверяем текущий пароль
            const isMatch = await bcrypt.compare(currentPassword, userCur.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }

            // хешируем новый пароль
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // обновляем пользователя
        const updatedUser = await updateUser(userId, name, email, hashedPassword);

        // редирект или JSON
        res.redirect("/projects");
        // или: res.json({ message: "Profile updated", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// DELETE /users/:id
export async function deleteUserController(req, res) {
    try {
        const { id } = req.params;

        const message = await deleteUser(id);

        res.json({ message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export default {
    getUsersController,
    getUserController,
    createUserController,
    updateUserController,
    deleteUserController
};