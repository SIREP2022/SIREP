let express = require('express');
let routeMovimientos = express.Router();
let contMovimientos = require('../controllers/controller.movimientos');
const auth = require('../middlewares/middleware.auth');

routeMovimientos.get('/venta', auth.authRoute, contMovimientos.renderMovimientos);
routeMovimientos.get('/listarMovimientos', auth.authToken,  contMovimientos.listarMovimientos);
routeMovimientos.get('/listarProductosPv', auth.authToken,  contMovimientos.listarProductos);
routeMovimientos.post('/consAddProd', auth.authToken,  contMovimientos.consAggProd);
routeMovimientos.post('/filtro', auth.authToken,  contMovimientos.filtro);
routeMovimientos.post('/genventa', auth.authToken,  contMovimientos.genVenta);
routeMovimientos.post('/agregarDetalle', auth.authToken,  contMovimientos.agregarDetalle);
routeMovimientos.post('/eliminarDetalle', auth.authToken,  contMovimientos.eliminarDetalle);
routeMovimientos.get('/listarPrecioProductos', auth.authToken,  contMovimientos.listarPreciosProductos);

/* ==============segunda parte ===== */
routeMovimientos.get('/listarDetalle/:idmovimiento', auth.authToken,  contMovimientos.mostrarDetalle);
routeMovimientos.get('/factura/:idmovimiento', auth.authToken, contMovimientos.mostrarDetalle);
routeMovimientos.post('/botoneditar', auth.authToken, contMovimientos.botonModaleditar);
routeMovimientos.post('/editar', auth.authToken, contMovimientos.editar);
routeMovimientos.post('/CambiarEstado', auth.authToken,  contMovimientos.CambiarEstado);
routeMovimientos.post('/AnularMovimiento', auth.authToken,  contMovimientos.AnularMovimiento);
routeMovimientos.post('/EstadoFacturado', auth.authToken, contMovimientos.EstadoFacturado);
routeMovimientos.post('/EstadoAnulado', auth.authToken, contMovimientos.EstadoAnulado);
routeMovimientos.post('/endCompra', auth.authToken, contMovimientos.endCompra);
/* ======== */
routeMovimientos.post('/validarAdmin', auth.authToken,  contMovimientos.validarAdmin);

module.exports = routeMovimientos;