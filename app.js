let express = require('express');
let servidor = express();
let bodyparser = require('body-parser');

servidor.use(express.static(__dirname + '/public'));
servidor.use(bodyparser.json());
servidor.use(bodyparser.urlencoded({ extended: false }));
servidor.set('view engine', 'ejs');
servidor.set('views', __dirname + '/views');

const dotenv = require('dotenv');
dotenv.config({path: './env/.env'});

const session = require('express-session');

servidor.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

servidor.use(require('./routes/route.views'));
servidor.use(require('./routes/route.reservas')); // Terminado
servidor.use(require('./routes/route.cliente')); //Terminado - Falta ASYNC
/* ============== */
servidor.use(require('./routes/route.productos')); // Terminado - Falta ASYNC
servidor.use(require('./routes/route.puntoventa')); // Terminado - Falta ASYNC
servidor.use(require('./routes/route.unidadesproductivas')); // Terminado - Falta ASYNC
servidor.use(require('./routes/route.inventario')); // Terminado - Falta ASYNC
servidor.use(require('./routes/route.reportes')); // Falta validar Ruta
servidor.use(require('./routes/route.gastronomia')); // JOSE
servidor.use(require('./routes/route.entrega')); // Terminado
servidor.use(require('./routes/route.movimientos')) // Terminado
servidor.use(require('./routes/route.produccionUp')) // Falta

servidor.get('*', (req, res) => {
    res.render('404')
})


servidor.use('/auth', require('./routes/route.auth'));
servidor.listen(3000, () => {
    console.log('Servidor 3000 activo.')
});