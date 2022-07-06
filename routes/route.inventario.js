const express = require('express');
const ruta_inventario = express.Router();
const controlador_inventario = require("../controllers/controller.inventario");
const auth = require('../middlewares/middleware.auth');

ruta_inventario.get("/inventario", auth.authRoute, controlador_inventario.Vista);
/* ============== */
ruta_inventario.get("/Lista_Inventario", auth.authToken, auth.isAdmin, controlador_inventario.ListaInventario);
ruta_inventario.post("/Registrar_inventario", auth.authToken, auth.isAdmin, controlador_inventario.registrarInventario);
ruta_inventario.post("/Buscar_Invent", auth.authToken, auth.isAdmin, controlador_inventario.BuscarInvent);
ruta_inventario.post("/Lista_produccion", auth.authToken, auth.isAdmin, controlador_inventario.ListaProduccion);
ruta_inventario.post("/idpdto_inventario", auth.authToken, auth.isAdmin, controlador_inventario.pdtoinventario);
ruta_inventario.post("/Lista_Bodega", auth.authToken, auth.isAdmin, controlador_inventario.ListarBodega);
ruta_inventario.post("/idpuntovent", auth.authToken, auth.isAdmin, controlador_inventario.Nombrepunt);
ruta_inventario.post("/llamarproduccion", auth.authToken, auth.isAdmin, controlador_inventario.valoresproduccion);
ruta_inventario.post("/Actualizarinvent", auth.authToken, auth.isAdmin, controlador_inventario.Actualizarinventario);

module.exports = ruta_inventario;