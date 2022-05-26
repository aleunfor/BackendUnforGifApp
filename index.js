const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
require('dotenv').config()

const dashboadRoutes = require('./routes/dashboard');
const verifyToken = require('./routes/validate-token');

const app = express();

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// cors
const cors = require('cors');
var corsOptions = {
    origin: 'http://localhost:3000', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// Conexión a Base de datos
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.DBNAME}.zpxsb.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => console.log('DB Connected'))
    .catch(e => console.log('DB Error:', e))

// import routes
const authRoutes = require('./routes/auth');

// route middlewares
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'It works!'
    })
});
app.use('/api/user', authRoutes);
app.use('/api/dashboard', verifyToken, dashboadRoutes);

// iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
})