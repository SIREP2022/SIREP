let express = require('express');
let routeIndex = express.Router();
let auth = require('../middlewares/middleware.auth');
let contIndex = require('../controllers/controller.index');

routeIndex.get('/', contIndex.renderIndex);
routeIndex.get('/admin', auth.authToken, contIndex.adminIndex);
routeIndex.get('/perfil', auth.authToken, auth.isAdmin,  contIndex.perfil)

module.exports = routeIndex;