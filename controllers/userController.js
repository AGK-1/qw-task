



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