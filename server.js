import userController from './controllers/userController';
import projectController from './controllers/projectController';
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const app = express();


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


const SESSION_SECRET = 'super-secret-basecamp-key-2026';

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

const isAuth = (req, res, next) => req.session.userId ? next() : res.redirect('/login');


const canManageProject = (req, project) => {
    return req.session.isAdmin || project.ownerId === req.session.userId;
};

app.use(express.json()); // Bodyy
app.use('/api', userController);
app.use('/api', projectController);


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`
    ✅ Server is running
    🔗 open in browser: http://localhost:${PORT}
    __________________________________
    `);
});