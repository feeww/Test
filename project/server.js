import 'dotenv/config'; 
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;

const users = [
    { id: 1, email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { id: 2, email: 'user@example.com', password: 'user123', role: 'user' }
];

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Missing token or invalid format' });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; 
        next(); 
    } catch (e) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

const roleMiddleware = (allowedRoles) => (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: You do not have access rights' });
    }
};

app.get('/', (req, res) => {
    res.send('<h1>Server is running! 🚀</h1><p>Use Postman or Curl to test /login</p>');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { sub: user.id, role: user.role },
        SECRET,
        { expiresIn: '15m' } 
    );

    res.json({ access_token: token, token_type: 'Bearer', expires_in: 900 });
});

app.get('/profile', authMiddleware, (req, res) => {
    res.json({
        message: 'Welcome to your profile',
        user_id: req.user.sub,
        role: req.user.role
    });
});

app.delete('/users/:id', authMiddleware, roleMiddleware(['admin']), (req, res) => {
    const userId = req.params.id;
    res.json({ message: `User ${userId} was deleted by Admin (Demo)` });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});