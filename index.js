// Our dependecies
const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const router = express.Router();

const APP_URL = "http://localhost/";


app.use(express.json())
app.use(cors(
    {origin: [APP_URL ],}
))

// Let us run the server. SO its running,
app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
})

// Let us create our database (mysql)
const db = mysql.createConnection({
    user: 'dbu918380',
    host: 'db5015663105.hosting-data.io',
    password: 'MEMAMMCJ02j#', //If you have set xampp password please enter it here
    database: 'dbs12785457',
})



//logica para mandar datos a la base de datos 

app.post('/register', (req, res)=>{
    // We need to get variables sent from the form
    const sentEmail =  req.body.Email
    const sentUserName =  req.body.UserName
    const sentPassword =  req.body.Password

    // Lets create SQL statement to insert the user to the Database table Users
    const SQL = 'INSERT INTO users (email, username, password) VALUES (?,?,?)' //We are going to enter these values through a variable
    const Values = [sentEmail, sentUserName, sentPassword]

    // Query to execute the sql statement stated above
    db.query(SQL, Values, (err, results)=>{
        if(err){
            res.send(err)
        }
        else{
            console.log('User inserted succcessfully!')
            res.send({message: 'User added!'})
            // Let try and see
            // user has not been submitted, we need to use Express and cors
            // Successful
        }
    })
    
})

// Now we need to login with these credentials from a registered User
// Lets create another route
app.post('/login', (req, res)=>{
     // We need to get variables sent from the form

     const sentloginUserName =  req.body.LoginUserName
     const sentLoginPassword =  req.body.LoginPassword
 
     // Lets create SQL statement to insert the user to the Database table Users
     const SQL = 'SELECT * FROM users WHERE username = ? && password = ?' //We are going to enter these values through a variable
     const Values = [sentloginUserName, sentLoginPassword]

      // Query to execute the sql statement stated above
    db.query(SQL, Values, (err, results)=>{
        if(err){
            console.log('Error')
        }
        if(results.length > 0){
            res.send(results)
        }
        else{
            res.send({message: `Credentials Don't match!`})
            // This should be goood, lets try to login.
        }
    })
})

//////////////////////////////////////////////LOGICA PRODUCTOS////////////////////////////////////////////////////////////////////////////////////////////////////
// Ruta para obtener todos los productos
router.get('/productos', (req, res) => {
    const sqlQuery = 'SELECT * FROM productos';
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos'});
            return;
        } 
        res.json(results);
    });
});

// Ruta para editar un producto
router.put('/productos/:id', (req, res) => {
    const productId = req.params.id;
    const { QR, Nombre, Categoria, Cantidad } = req.body; // Agregamos Cantidad aquí

    const sqlQuery = 'UPDATE productos SET QR = ?, Nombre = ?, Categoria = ?, Cantidad = ? WHERE IdProducto = ?'; // Agregamos Cantidad aquí
    const values = [QR, Nombre, Categoria, Cantidad, productId]; // Agregamos Cantidad aquí

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



// Ruta para eliminar un producto
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

// Ruta para agregar un nuevo producto
router.post('/productos', (req, res) => {
    // Extraemos los datos del cuerpo de la solicitud
    const { QR, Nombre, Categoria } = req.body;

    // Creamos la consulta SQL para insertar el nuevo producto
    const SQL = 'INSERT INTO productos (QR, Nombre, Categoria) VALUES (?, ?, ?)';
    const values = [QR, Nombre, Categoria];

    // Ejecutamos la consulta SQL
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

//-----------------------------------------------Arduino--------------------------------------------------------------
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
            // Aquí agregamos la categoría al objeto que vamos a devolver
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


// Usar el enrutador definido para todas las rutas bajo /api
app.use('/api', router);

//////////////////////////////////////////////////////LOGICA USUARIOS///////////////////////////////////////////////////////////////////////////77
// Ruta para obtener todos los usuarios
router.get('/users', (req, res) => {
    const sqlQuery = 'SELECT * FROM users';
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            res.status(500).json({ error: 'Error al obtener usuarios'});
            return;
        } 
        res.json(results);
    });
});

// Ruta para editar un producto
router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const {  email, username, password} = req.body; // Agregamos Password aquí

    const sqlQuery = 'UPDATE users SET  email = ?, username = ?, password = ? WHERE id = ?'; // Agregamos Password aquí
    const values = [ email, username, password, userId]; // Agregamos Cantidad aquí

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



// Ruta para eliminar un producto
router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;

    const sqlQuery = 'DELETE FROM users WHERE id = ?';
    const values = [userId];

    db.query(sqlQuery, values, (err, result) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            res.status(500).json({ error: 'Error al eliminar uaurio' });
            return;
        }
        console.log('Usuario eliminado exitosamente');
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    });
});

// Ruta para agregar un nuevo producto
router.post('/users', (req, res) => {
    // Extraemos los datos del cuerpo de la solicitud
    const { email, username, password } = req.body;

    // Creamos la consulta SQL para insertar el nuevo producto
    const SQL = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    const values = [email, username, password];

    // Ejecutamos la consulta SQL
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

//------------------------------------------logica para las graficas -----------------------------------------------------------------------------
