import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import session from 'express-session';
import { initDB } from './tmp/db.js'


const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'my-secret-key', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
    } 
}));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/register', async (req, res) => {
    console.log("Get data:", req.body);
    const { name, email, password, password_confirmation } = req.body;
    const db = await initDB();

    try {
        
        if (!password || password.trim() === "") {
            return res.status(400).render("register", {
                error: null,        
                pass: "Password is empty!",
                pass_confirm: null
            });
        };
        if (password != password_confirmation) {
            return res.status(400).render("register", {
                error: null,          
                pass: null,
                pass_confirm: "Password is not same"
            });
        };
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

       
        await db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'user']
        );

        res.status(201).send("<h1 style='color:green;'>Account successfully created</h1>\nYou can <a href='/login'>login</a>.");
    } catch (error) {
        if (error.message.includes("UNIQUE constraint failed")) {
            return res.status(400).render("register", {
                error: "Email has already existed"
            });
        }
        else {
            console.error(error);
            res.status(500).send("Server error");
        }
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const db = await initDB();
    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            return res.status(401).send("Wrong email or password");
        }

        
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
        
            req.session.userId = user.id;
            req.session.userName = user.name;
            req.session.userEmail = user.email;
            req.session.userRole = user.role;
            console.log("Okey");
           
            return res.redirect('/projects');

        
        } else {
           
            res.status(401).send("Wrong email or password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
})

app.get('/projects', async (req, res) => {
   
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const db = await initDB();
  
    const projects = await db.all('SELECT * FROM projects WHERE user_id = ?', [req.session.userId]);
    const all_projects = await db.all('SELECT * FROM projects WHERE user_id != ?', [req.session.userId]);
  
    res.render('projects', {
        userName: req.session.userName,
        userEmail: req.session.userEmail,
        projects: projects,
        all_projects: all_projects
    });
});

app.post('/projects/delete/:id', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    const db = await initDB();
    await db.run(
        'DELETE FROM projects WHERE id = ? AND user_id = ?',
        [req.params.id, req.session.userId]
    );
    res.redirect('/projects');
});

app.get("/register", (req, res) => {
    res.render("register", { error: null, pass: null, pass_confirm: null });
});

app.get("/login", (req, res) => {
    res.render("login");
});


app.get('/projects/new', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('new-project', {
        userName: req.session.userName,
        userEmail: req.session.userEmail
    });
});

app.post('/projects/new', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const { name, description } = req.body;

    const db = await initDB();
    await db.run(
        'INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)',
        [name, description, req.session.userId]
    );

    res.redirect('/projects');
});

app.post('/projects/update', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const { id, name, description } = req.body;

    const db = await initDB();

    await db.run(
        'UPDATE projects SET name = ?, description = ? WHERE id = ? AND user_id = ?',
        [name, description, id, req.session.userId]
    );

    res.redirect('/projects');
})

app.get('/projects/edit/:id', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const db = await initDB();

    const project = await db.get(
        'SELECT * FROM projects WHERE id = ? AND user_id = ?',
        [req.params.id, req.session.userId]
    );

    if (!project) {
        return res.redirect('/projects');
    }

    res.render('update-project', { project });
});


app.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Ошибка при выходе");
        }
        res.redirect('/login');
    });
});

app.listen(3000, async (req, res) => {
    console.log("Server running in http://localhost:3000/projects");
});