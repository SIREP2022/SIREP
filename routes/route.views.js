const express = require('express');
const route = express.Router();
const auth = require('../middlewares/middleware.auth');
const contIndex = require('../controllers/controller.views');
const cont_reserva = require("../controllers/controller.reservas");


route.get('/', contIndex.renderIndex);
route.get('/admin', auth.authRoute, cont_reserva.Abrir_Frm_Reserva);
route.get('/perfil', auth.authRoute, contIndex.perfil);
route.get('/manuales', auth.authRoute, contIndex.ayuda);
route.get("/ListarTodosProductos", auth.authRoute, cont_reserva.Listar_Todos_Productos);

module.exports = route;