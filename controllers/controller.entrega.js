const query = require('../database/pool-conexion') 
controller = {}

controller.viewEntrega = (req, res)=> {res.render('venta/entrega-producto', {profile: req.session.user})}
controller.entregar = async(req, res) => {
    let id_detalle = req.body.id_detalle;
    try{
        let sql = `UPDATE detalle SET Entregado = 'Entregado' WHERE id_detalle = ${id_detalle} and Estado = 'Facturado'`;
        await query(sql);
        return res.json({  
            titulo : "Entrega exitosa",
            icono: "success",
            mensaje : "El producto fue entregado de forma exitosa",
            timer : 1000
        });
    } catch(e) {
        console.log(e)
    }
}
controller.productoNoEntregado = async (req, res) => {
    let id_detalle = req.params.id_detalle;
    if(!id_detalle) return res.json({status: 'error', message: 'El id del detalle es requerido'})
    try{
        let sql = `UPDATE detalle SET Entregado = 'No Reclamado' WHERE id_detalle = '${id_detalle}' and Estado = 'Facturado'`;
        await query(sql);
        return res.json({  
            titulo : "No Reclamado",
            icono: "success",
            mensaje : "El producto fue declarado como no reclamado",
            timer : 1500
        });
    } catch(e) {
        console.log(e)
    }
}

controller.listarEntregas = async (req, res) => {
    try{     
        var identificacion = req.body.identificacion;
        var IdUP = req.session.user.up_id; //SESION DE USUARIO
        var sql =  `SELECT d.id_detalle, per.identificacion, per.Nombres, per.Ficha, 
        p.Nombre as producto, d.cantidad, d.valor, d.Entregado as Estado,  d.fecha FROM movimientos m 
        JOIN detalle d on d.fk_Id_movimiento = m.Id_movimiento 
        JOIN personas per on per.identificacion = d.Persona 
        JOIN inventario i on i.id_inventario = d.fk_id_inventario JOIN productos p on 
        p.Codigo_pdto = i.fk_codigo_pdto where p.fk_codigo_up = '${IdUP}' 
        and m.Estado = 'Facturado' and d.Estado = 'Facturado' and d.Entregado = 'No entregado' 
        and per.identificacion = '${identificacion}'`;  
        let rows = await query(sql);
        return res.json(rows);
    }
    catch(e){
        console.log(e);
    }
}
controller.listarPorEntregar = async (req, res) => {
    var IdUP = req.session.user.up_id; //SESION DE USUARIO
    let sql = `SELECT d.id_detalle, per.identificacion, per.Nombres, per.Ficha, 
    p.Nombre as producto, d.cantidad, (d.cantidad * d.valor) as valor, d.Entregado as Estado,  d.fecha FROM movimientos m 
    JOIN detalle d on d.fk_Id_movimiento = m.Id_movimiento 
    JOIN personas per on per.identificacion = d.Persona 
    JOIN inventario i on i.id_inventario = d.fk_id_inventario JOIN productos p on 
    p.Codigo_pdto = i.fk_codigo_pdto where p.fk_codigo_up = ${IdUP}
    and m.Estado = 'Facturado' and d.Estado = 'Facturado' and d.Entregado = 'No entregado'
    and MONTH(d.fecha) = MONTH(CURDATE()) and YEAR(d.fecha) = YEAR(CURDATE())`;
    try {
        let rows = await query(sql);
        return res.json(rows);
    } catch(e){
        console.log(e)
    }
}
controller.cantidadPendiente = async (req, res) => {
    var IdUP = req.session.user.up_id; //SESION DE USUARIO
    let sql = `SELECT COUNT(*) as cantidad FROM listamovimientos WHERE codigo_up = '${IdUP}' and Estado = 'Facturado' and Entregado = 'No Entregado';`
    let rows = await query(sql);
    return res.json(rows);
}

controller.listarNoReclamado = async (req, res) => {
    var IdUP = req.session.user.up_id; //SESION DE USUARIO
    let sql = `SELECT d.id_detalle, per.identificacion, per.Nombres, per.Ficha, 
    p.Nombre as producto, d.cantidad, (d.cantidad * d.valor) as valor, d.Entregado as Estado,  d.fecha FROM movimientos m 
    JOIN detalle d on d.fk_Id_movimiento = m.Id_movimiento 
    JOIN personas per on per.identificacion = d.Persona 
    JOIN inventario i on i.id_inventario = d.fk_id_inventario JOIN productos p on 
    p.Codigo_pdto = i.fk_codigo_pdto where p.fk_codigo_up = ${IdUP}
    and m.Estado = 'Facturado' and d.Estado = 'Facturado' and d.Entregado = 'No reclamado'
    and MONTH(d.fecha) = MONTH(CURDATE()) and YEAR(d.fecha) = YEAR(CURDATE())`;
    try {
        let rows = await query(sql);
        return res.json(rows);
    } catch(e){
        console.log(e)
    }
}
module.exports = controller;