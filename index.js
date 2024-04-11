// Dependencias
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const router = express.Router();

// Variables de entorno
const FRONT_URL = process.env.FRONT_URL || "http://localhost:5173/";
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors({
    origin: FRONT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Conexión a la base de datos
const db = mysql.createConnection({
    user: 'dbu918380',
    host: 'db5015663105.hosting-data.io',
    password: 'MEMAMMCJ02j#',
    database: 'dbs12785457',
});

if (db === null) {
    console.log("Hay un error en la base de datos");
} else {
    console.log("Conexión a la base de datos establecida correctamente");
}

// Rutas para registro y login de usuarios
app.post('/register', (req, res) => {
    const { Email, UserName, Password } = req.body;
    const SQL = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    const Values = [Email, UserName, Password];

    db.query(SQL, Values, (err, results) => {
        if (err) {
            console.error('Error al insertar usuario:', err);
            res.status(500).json({ error: 'Error al insertar usuario' });
            return;
        }
        console.log('Usuario insertado correctamente');
        res.status(200).json({ message: 'Usuario insertado correctamente' });
    });
});

app.post('/login', (req, res) => {
    const { LoginUserName, LoginPassword } = req.body;
    const SQL = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const Values = [LoginUserName, LoginPassword];

    db.query(SQL, Values, (err, results) => {
        if (err) {
            console.error('Error al realizar el login:', err);
            res.status(500).json({ error: 'Error al realizar el login' });
            return;
        }
        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(401).json({ message: `Las credenciales no coinciden` });
        }
    });
});

// Rutas relacionadas con productos
router.get('/productos', (req, res) => {
    const sqlQuery = 'SELECT * FROM productos';
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

router.put('/productos/:id', (req, res) => {
    const productId = req.params.id;
    const { QR, Nombre, Categoria, Cantidad } = req.body;

    const sqlQuery = 'UPDATE productos SET QR = ?, Nombre = ?, Categoria = ?, Cantidad = ? WHERE IdProducto = ?';
    const values = [QR, Nombre, Categoria, Cantidad, productId];

    db.query(sqlQuery, values, (err, result) => {
        if (err) {
            console.error('Error al editar producto:', err);
            res.status(500).json({ error: 'Error al editar producto' });
            return;
        }
        console.log('Producto editado exitosamente');
        res.status(200).json({ message: 'Producto editado exitosamente' });
    });
});

router.delete('/productos/:id', (req, res) => {
    const productId = req.params.id;

    const sqlQuery = 'DELETE FROM productos WHERE IdProducto = ?';
    const values = [productId];

    db.query(sqlQuery, values, (err, result) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        console.log('Producto eliminado exitosamente');
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    });
});

router.post('/productos', (req, res) => {
    const { QR, Nombre, Categoria } = req.body;

    const SQL = 'INSERT INTO productos (QR, Nombre, Categoria) VALUES (?, ?, ?)';
    const values = [QR, Nombre, Categoria];

    db.query(SQL, values, (err, result) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        console.log('Producto insertado correctamente');
        res.status(200).json({ message: 'Producto insertado correctamente' });
    });
});

router.get('/productos/ultimo', (req, res) => {
    const sqlQuery = 'SELECT * FROM productos ORDER BY IdProducto DESC LIMIT 1';
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error al obtener el último registro de productos:', err);
            res.status(500).json({ error: 'Error al obtener el último registro de productos' });
            return;
        }
        if (result.length > 0) {
            const ultimoProducto = result[0];
            const respuesta = {
                IdProducto: ultimoProducto.IdProducto,
                QR: ultimoProducto.QR,
                Nombre: ultimoProducto.Nombre,
                Categoria: ultimoProducto.Categoria,
                Cantidad: ultimoProducto.Cantidad
            };
            res.json(respuesta);
        } else {
            res.status(404).json({ error: 'No se encontraron productos' });
        }
    });
});

// Rutas relacionadas con usuarios
router.get('/users', (req, res) => {
    const sqlQuery = 'SELECT * FROM users';
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            res.status(500).json({ error: 'Error al obtener usuarios' });
            return;
        }
        res.json(results);
    });
});

router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { email, username, password } = req.body;

    const sqlQuery = 'UPDATE users SET email = ?, username = ?, password = ? WHERE id = ?';
    const values = [email, username, password, userId];

    db.query(sqlQuery, values, (err, result) => {
        if (err) {
            console.error('Error al editar usuario:', err);
            res.status(500).json({ error: 'Error al editar usuario' });
            return;
        }
        console.log('Usuario editado exitosamente');
        res.status(200).json({ message: 'Usuario editado exitosamente' });
    });
});

router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;

    const sqlQuery = 'DELETE FROM users WHERE id = ?';
    const values = [userId];

    db.query(sqlQuery, values, (err, result) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            res.status(500).json({ error: 'Error al eliminar usuario' });
            return;
        }
        console.log('Usuario eliminado exitosamente');
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    });
});

router.post('/users', (req, res) => {
    const { email, username, password } = req.body;

    const SQL = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    const values = [email, username, password];

    db.query(SQL, values, (err, result) => {
        if (err) {
            console.error('Error al insertar usuario:', err);
            res.status(500).json({ error: 'Error al insertar usuario' });
            return;
        }
        console.log('Usuario insertado correctamente');
        res.status(200).json({ message: 'Usuario insertado correctamente' });
    });
});

// Usar el enrutador definido para todas las rutas bajo /api
app.use('/api', router);
