const query = require("../database/pool-conexion");
let controllerReportes = {};

/* ================= ROL ADMINISTRADOR================= */
controllerReportes.vista_reporteAdmin = (req, res) =>{
    try{
        res.render('reportes/rep_admin', {profile: req.session.user});
    }
    catch(e){
        console.log(e);
    } 
}
controllerReportes.reporte_reporteAdmin = async (req, res) =>{
    try{
        let fechainicio = req.body.fechastart;
        let fechafin = req.body.fechaend;
        var sql_reporte_venta_punto =  `SELECT m.up, SUM(m.cantidad) as cantidad, SUM(m.subtotal) as subtotal,  date_format(MIN(m.fecha), "%Y-%m-%d") as fecha_min, date_format(MAX(m.fecha), "%Y-%m-%d") as fecha_max FROM listamovimientos m where m.fecha between '${fechainicio}' and '${fechafin}' and m.Estado = 'Facturado' GROUP BY m.codigo_up`;
        let rows = await query(sql_reporte_venta_punto);
        res.json(rows);
    }
    catch(e){
        console.log(e);
    } 
}
/* ===================================================== */
controllerReportes.vista_rep_val_admi = (req, res) =>{
    try{
        res.render('reportes/rep_val_admi', {profile: req.session.user});
    }
    catch(e){
        console.log(e);
    } 
}
controllerReportes.reporte_rep_val_admi = async (req, res) =>{
    try{
        let fechainicio = req.body.fechastart;
        let fechafin = req.body.fechaend;
        var sql_reporte_venta_punto =  `SELECT m.producto, SUM(m.cantidad) as cantidad, SUM(m.subtotal) as valor, date_format(MIN(m.fecha), "%Y-%m-%d") as fecha_min, date_format(MAX(m.fecha), "%Y-%m-%d") as fecha_max FROM listamovimientos m where m.fecha between '${fechainicio}' and '${fechafin}' and m.Estado = 'Facturado' GROUP BY Codigo_pdto`;
        let rows = await query(sql_reporte_venta_punto);
        res.json(rows);
    }
    catch(e){
        console.log(e);
    } 
}
/* ===================================================== */
controllerReportes.vista_reporDPV = (req, res) =>{
    try{
        res.render('reportes/reporDPV_admi', {profile: req.session.user});
    }
    catch(e){
        console.log(e);
    } 
}
controllerReportes.reporte_reporDPV = async (req, res) =>{
    try{
        var sql_reporte_venta_punto =  `SELECT m.punto, m.producto, m.stock FROM listamovimientos m GROUP BY m.Codigo_pdto, m.id_punto_vent;`;
        let rows = await query(sql_reporte_venta_punto);
        res.json(rows);
    }
    catch(e){
        console.log(e);
    } 
}
/* ===================================================== */
controllerReportes.vista_rep_produccion_admi = (req, res) =>{
    try{
        res.render('reportes/rep_produccion_admi', {profile: req.session.user});
    }
    catch(e){
        console.log(e);
    } 
}
controllerReportes.reporte_rep_produccion_admi  = async (req, res) =>{
     try{   
        var sql_reporte_venta_punto =  `SELECT if(sum(up.Disponible) is null,0,sum(up.Disponible)) as stockcant, up.producto as 
        pdto_nombre, up.nomb_up as Nombre FROM lista_produccion_up up group by up.codigo_up, up.Codigo_pdto; ;`;
        let rows = await query(sql_reporte_venta_punto);
        res.json(rows);
          
    }
    catch(e){
        console.log(e);
    } 
}
/* ===================================================== */
controllerReportes.vista_reporVent = (req, res) =>{
    try{
        res.render('reportes/reporVent', {profile: req.session.user});
    }
    catch(e){
        console.log(e);
    } 
}
controllerReportes.reporte_reporVent = async (req, res) =>{
    try{   
        let fechainicio = req.body.fechastart;
        let fechafin = req.body.fechaend;
        var sql_reporte_venta_punto =  `SELECT m.punto, SUM(m.subtotal) as subtotal FROM listamovimientos m where m.fecha between '${fechainicio}' and '${fechafin}' and m.Estado = 'Facturado' GROUP  BY id_punto_vent`;
        let rows = await query(sql_reporte_venta_punto);
        res.json(rows);    
    }
    catch(e){
        console.log(e);
    } 
}
/* ===================================================== */
controllerReportes.vista_Reporcanti= (req, res) =>{
    try{
        res.render('reportes/Reporcanti', {profile: req.session.user});
    }
    catch(e){
        console.log(e);
    } 
}
controllerReportes.Reporte_Reporcanti = async (req, res) =>{
    try{   
        let fechainicio = req.body.fechastart;
        let fechafin = req.body.fechaend;
        var sql_reporte_venta_punto =  `SELECT m.punto, m.producto, SUM(m.cantidad) as cantidad, SUM(m.subtotal) as subtotal, date_format(MIN(m.fecha), "%Y-%m-%d") as fecha_min, date_format(MAX(m.fecha), "%Y-%m-%d") as fecha_max FROM listamovimientos m where m.fecha between '${fechainicio}' and '${fechafin}' and m.Estado = 'Facturado' GROUP BY m.punto, Codigo_pdto, m.producto;` ;
        console.log(sql_reporte_venta_punto)
        let rows = await query(sql_reporte_venta_punto);
        res.json(rows);
    }
    catch(e){
        console.log(e);
    } 
}
/*======================= ROL UNIDADES PRODUCTIVAS=======================*/
controllerReportes.vista_reportUp  = (req, res) =>{
    try{
        res.render('reportes/reportUp', {profile: req.session.user});
    }
    catch(e){
        console.log(e);
    } 
}
controllerReportes.reporte_reportUp =  async (req, res) =>{
    try{   
        let fechainicio = req.body.fechastart;
        let fechafin = req.body.fechaend;
        let unidadproductiva = req.session.up;
        var sql_reporte_venta_punto =  `SELECT Codigo_pdto, producto as pdto_nombre, Producido as cantidpdto FROM lista_produccion_up WHERE 
        codigo_up = '${unidadproductiva}' and fecha between '${fechainicio}' and '${fechafin}'`;
        let rows = await query(sql_reporte_venta_punto);
        res.json(rows);
    }
    catch(e){
        console.log(e);
    } 
}
/*======================= ROL PUNTO VENTA=======================*/
controllerReportes.vista_Reporte_Pvent = (req, res) =>{
    try{
        res.render('reportes/reporte_Pvent', {profile: req.session.user});
    }
    catch(e){
        console.log(e);
    } 
}
controllerReportes.reporte_Reporte_Pvent = async (req, res) =>{
    try{   
        let fechainicio = req.body.fechastart;
        let fechafin = req.body.fechaend;
        var sesion = req.session.pv;
        var sql_reporte_venta_punto =  `SELECT m.producto, sum(m.cantidad) as cantidad, SUM(m.subtotal) as subtotal, date_format(MIN(m.fecha), "%Y-%m-%d") as fecha_min, date_format(MAX(m.fecha), "%Y-%m-%d") as fecha_max FROM listamovimientos m where id_punto_vent = '${sesion}' and m.fecha between '${fechainicio}' and '${fechafin}' and m.Estado = 'Facturado' GROUP BY Codigo_pdto`;
        console.log(sql_reporte_venta_punto)
        let rows = await query(sql_reporte_venta_punto);
        res.json(rows)          
    }
    catch(e){
        console.log(e);
    } 
}

/*======================= ROL PUNTO VENTA=======================*/
controllerReportes.vista_Reporte_Productos_Facturados = (req, res) =>{
    try{
        res.render('reportes/productos_facturadosPV', {profile: req.session.user});
    }
    catch(e){
        console.log(e);
    } 
}
controllerReportes.reporte_Productos_Facturados = async (req, res) =>{
    try{   
        let fechainicio = req.body.fechastart;
        let fechafin = req.body.fechaend;
        let sesion = req.session.user.pv;
        
        var sql_reporte_venta_punto =  `SELECT m.producto, sum(m.cantidad) as cantidad, SUM(m.subtotal) as subtotal, date_format(MIN(m.fecha), "%Y-%m-%d") as fecha_min, date_format(MAX(m.fecha), "%Y-%m-%d") as fecha_max FROM listamovimientos m where id_punto_vent = '${sesion}' and m.fecha between '${fechainicio}' and '${fechafin}' and m.Estado = 'Facturado' GROUP BY Codigo_pdto`;
        let rows = await query(sql_reporte_venta_punto);
        res.json(rows)          
    }
    catch(e){
        console.log(e);
    } 
}

controllerReportes.reporte_Productos_Facturados_UP = async (req, res) =>{
    try{   
        let fechainicio = req.body.fechastart;
        let fechafin = req.body.fechaend;
        let sesion = req.session.up;
        
        var sql_reporte_venta_punto =  `SELECT m.producto, sum(m.cantidad) as cantidad, SUM(m.subtotal) as subtotal, date_format(MIN(m.fecha), "%Y-%m-%d") as fecha_min, date_format(MAX(m.fecha), "%Y-%m-%d") as fecha_max FROM listamovimientos m where codigo_up = '${sesion}' and m.fecha between '${fechainicio}' and '${fechafin}' and m.Estado = 'Facturado' GROUP BY Codigo_pdto`;
        console.log(sql_reporte_venta_punto)
        let rows = await query(sql_reporte_venta_punto);
        res.json(rows)          
    }
    catch(e){
        console.log(e);
    } 
}
/* ===================================================== */
module.exports = controllerReportes;