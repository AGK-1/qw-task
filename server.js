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


let users = [];
let projects = [];

const isAuth = (req, res, next) => req.session.userId ? next() : res.redirect('/login');


const canManageProject = (req, project) => {
    return req.session.isAdmin || project.ownerId === req.session.userId;
};



app.get('/', (req, res) => res.redirect('/projects'));

app.get('/login', (req, res) => res.render('login', { error: null }));

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id;
        req.session.isAdmin = user.isAdmin || false;
        return res.redirect('/projects');
    }
    res.render('login', { error: 'Неверный логин или пароль' });
});

app.get('/register', (req, res) => res.render('register', { error: null }));

app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (users.find(u => u.email === email)) {
        return res.render('register', { error: 'Пользователь с таким Email уже есть' });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = {
        id: Date.now().toString(),
        email,
        password: hash,
        isAdmin: users.length === 0
    };

    users.push(newUser);
    res.redirect('/login');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/projects', isAuth, (req, res) => {
    const myProjects = projects.filter(p => req.session.isAdmin || p.ownerId === req.session.userId);
    res.render('projects', {
        projects: myProjects,
        isAdmin: req.session.isAdmin
    });
});


app.post('/projects', isAuth, (req, res) => {
    const newProject = {
        id: Date.now().toString(),
        title: req.body.title || 'Новый проект',
        ownerId: req.session.userId,
        tasks: []
    };
    projects.push(newProject);
    res.redirect('/projects');
});


app.get('/projects/:id', isAuth, (req, res) => {
    const project = projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).send('Проект не найден');

    if (!canManageProject(req, project)) {
        return res.status(403).send('Доступ запрещен');
    }
    res.render('project_show', { project });
});


app.get('/projects/:id/edit', isAuth, (req, res) => {
    const project = projects.find(p => p.id === req.params.id);
    if (!project || !canManageProject(req, project)) {
        return res.status(403).send('Нет прав на редактирование');
    }
    res.render('project_edit', { project });
});


app.post('/projects/:id/update', isAuth, (req, res) => {
    const project = projects.find(p => p.id === req.params.id);
    if (project && canManageProject(req, project)) {
        project.title = req.body.title;
    }
    res.redirect('/projects');
});

app.post('/projects/:id/delete', isAuth, (req, res) => {
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index !== -1 && canManageProject(req, projects[index])) {
        projects.splice(index, 1);
    }
    res.redirect('/projects');
});


app.post('/projects/:id/tasks', isAuth, (req, res) => {
    const project = projects.find(p => p.id === req.params.id);
    if (project && canManageProject(req, project)) {
        project.tasks.push({
            id: Date.now().toString(),
            text: req.body.text,
            completed: false
        });
    }
    res.redirect(`/projects/${req.params.id}`);
});

app.post('/projects/:pId/tasks/:tId/toggle', isAuth, (req, res) => {
    const project = projects.find(p => p.id === req.params.pId);
    if (project && canManageProject(req, project)) {
        const task = project.tasks.find(t => t.id === req.params.tId);
        if (task) task.completed = !task.completed;
    }
    res.redirect(`/projects/${req.params.pId}`);
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
    ✅ Server is running
    🔗 open in browser: http://localhost:${PORT}
    __________________________________
    `);
});