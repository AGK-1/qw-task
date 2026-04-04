import { initDB } from '../db/db.js';
import bcrypt from 'bcrypt';

export async function login(req, res) {
    const { email, password } = req.body;

    const db = await initDB();

    const user = await db.get(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Wrong password' });
    }

    // 💥 сохраняем в session 555
    req.session.userId = user.id;

    res.json({
        message: 'Login successful',
        userId: user.id
    });
}