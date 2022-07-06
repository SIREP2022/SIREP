const express = require('express');
const ruta = express.Router();
const cont_produccion = require("../controllers/controller.produccionUp");
const auth = require('../middlewares/middleware.auth');

ruta.get('/produccion', auth.authRoute, cont_produccion.Produccion);
ruta.post('/formR',  auth.authToken, auth.isAdmin,  cont_produccion.RegistrarProduccion);
ruta.post("/Listar_Produccion", auth.authToken, auth.isAdmin, cont_produccion.Listar_Produccion);
ruta.post('/editarProduccion', auth.authToken, auth.isAdmin, cont_produccion.editarProduccion);
ruta.post('/llamarproductos', auth.authToken, auth.isAdmin, cont_produccion.llamarproductos);
ruta.post("/Buscarproduccion", auth.authToken, auth.isAdmin, cont_produccion.Buscarproduccion);


module.exports = ruta;