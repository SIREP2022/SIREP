let express = require('express');
let route = express.Router();

let controller = require('../controllers/controller.entrega');
/* ===MIDDLEWARE */
let auth = require('../middlewares/middleware.auth');

route.get('/entregar-producto', auth.authRoute, controller.viewEntrega);
route.get('/listar-no-entregados', auth.authToken, auth.isLiderUP, controller.listarPorEntregar);
route.get('/listar-no-reclamados', auth.authToken, auth.isLiderUP, controller.listarNoReclamado);
route.get('/cantidad-pendiente', auth.authToken, auth.isLiderUP, controller.cantidadPendiente);
route.post('/entrega', auth.authToken, auth.isLiderUP, controller.listarEntregas);
route.post('/entregar-producto', auth.authToken,  auth.isLiderUP, controller.entregar);
route.post('/producto-no-entregado/:id_detalle', auth.authToken,  auth.isLiderUP, controller.productoNoEntregado)

module.exports = route;