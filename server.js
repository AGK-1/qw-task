import express from 'express';
import session from 'express-session';
import authRouter from './routes/authRoutes.js'; // <--- здесь твой authRouter
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';

import { isAuth } from './middlewares/authMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(path.resolve(), 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
}));

app.get('/login', (req, res) => {
    res.render('login'); // login ejs
});


app.get('/register', (req, res) => {
    res.render('register'); // register ejs
});


app.get('/', (req, res) => {
    res.render('index');
});


app.get('/me', isAuth, (req, res) => {
    res.send(`Привет, пользователь с ID: ${req.session.userId}`);
});


app.get('/projects', isAuth, async (req, res) => {
    res.render('projects', { userId: req.session.userId });
});

app.get('/new-project', isAuth, (req, res) => {
    res.render('new-project');
});

app.get('/edit-profile', isAuth, (req, res) => {
    res.render('edit-profile');
});

app.get('/update-project/:projectId', (req, res) => {
    res.render('update-project');
});

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/projects', projectRouter);



app.listen(3000, () => console.log('Server running on port 3000  http://localhost:3000/'));