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
        const { id } = req.params;
        const user = await getUser(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
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
        const { id } = req.params;
        const { name, email, password } = req.body;

        let hashedPassword;

        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const user = await updateUser(id, name, email, hashedPassword);

        res.json(user);
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