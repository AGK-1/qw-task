import { initDB } from '../tmp/db.js';
import bcrypt from 'bcrypt';

export function logoutController(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Logout error');
        }

        res.clearCookie('connect.sid'); // удалить cookie
        res.redirect('/login');
    });
}

export async function loginController(req, res) {
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

    // 💥 save session session 555
    req.session.userId = user.id;
    res.redirect('/projects');
    // res.json({
    //     message: 'Login successful',
    //     userId: user.id
    // });
}