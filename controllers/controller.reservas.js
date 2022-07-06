const query = require("../database/pool-conexion");
const controlador = {};


controlador.Listar_Todos_Productos = async(req, res) => {
    var sesion_Cargo = req.session.user.id_cargo; 
    let sql = 'select id_inventario,Producto as producto,descripcion,tipo,imagen,reserva,stock,MaxReserva, hora_inicio, hora_fin, nomb_up as up, ';
    if(sesion_Cargo==1){
        sql += `aprendiz as precio,Nombre as pv    from lista_productos order by Producto   `;
    }
    if(sesion_Cargo==2){
        sql += `instructor as precio,Nombre as pv    from lista_productos order by Producto `;
    }
    if(sesion_Cargo==3){
        sql += `administrativo as precio,Nombre as pv    from lista_productos order by Producto  `;
    }
    if(sesion_Cargo==4){
        sql += `externo as precio,Nombre as pv    from lista_productos order by Producto `;
    }

    if(sesion_Cargo==5){
        sql += `auxiliares as precio,Nombre as pv    from lista_productos  `;
    }
     
    try{
        let productos = await query(sql);
        res.json(productos);
         
    } catch (e){
        console.log(e)
    }
}

controlador.Abrir_Frm_Reserva = (req, res) => {   res.render('reservas/reserva.ejs', {profile: req.session.user})}
controlador.Buscar_Producto = async(req, res) => {
    let name = req.body.Codigo;
    let sql = "select Nombre from producto where Codigo_pdto=" + name;
    try {
        let rows = await query(sql);
        return res.json(rows);
    } catch(e){
        console.log(e)
    }
}
controlador.Listar_Reservas_Pendientes = async(req, res) => {
    var sesion_persona = req.session.user.identificacion ; 
    let sql1 = `call Administrar_Reserva('Buscar_Reserva',${sesion_persona})`;;
    try {
        let rows = await query(sql1);
        return res.json(rows[0]);
    } catch (e) {
        console.log("error: " + e)
    } 
}
controlador.Listar_Usuaios_Ficha =  async(req, res) => {
    sql = `SELECT identificacion,Nombres FROM personas where Ficha = '${req.body.idFicha}'`
    try{
        let rows = await query(sql);
        if(rows.length <= 0) return res.json({status: '404', message: 'Ficha no encontrada'})
        return res.json(rows)
    } catch (e) {
        console.log(e)
    }
}

controlador.Registrar_Detalle = async(req, res) => {
    var sesion_Cargo = req.session.user.id_cargo; 
    var persona = req.body.persona;
    var cantidad = req.body.cantidad;
    var movimiento = req.body.id_movimiento;
    var inventario = req.body.id_producto;

    if(sesion_Cargo==1){
        sql = `select aprendiz as precio from lista_productos where id_inventario = '${inventario}' LIMIT 1;`;
    }
    if(sesion_Cargo==2){
        sql = `select instructor as precio from lista_productos where id_inventario = '${inventario}' LIMIT 1;`;
    }
    if(sesion_Cargo==3){
        sql = `select administrativo as precio from lista_productos where id_inventario = '${inventario}' LIMIT 1;`;
    }
    if(sesion_Cargo==4){
        sql = `select externo as as precio from lista_productos where id_inventario = '${inventario}' LIMIT 1;`;
    }

    if(sesion_Cargo==5){
        sql = `select auxiliar as precio from lista_productos where id_inventario = '${inventario}' LIMIT 1;`;
    }
    let producto = `SELECT Codigo_pdto, MaxReserva, inventario FROM inventario i join productos p on i.fk_codigo_pdto = Codigo_pdto where id_inventario = '${inventario}';`
    let producto_row = await query(producto);
    if(producto_row[0].MaxReserva < cantidad) return res.json({  
        titulo : "Reserva superada",
        icon: "error",
        text : "Has superado el límite máximo de reserva"
    });
    let cantidadPdto = `SELECT sum(cantidad) as cantidad FROM listamovimientos 
    where Id_movimiento = '${movimiento}' and Codigo_pdto = '${producto_row[0].Codigo_pdto}' and identificacion = '${persona}';`
    let cantidadPdto_Rows = await query(cantidadPdto);
    if((parseInt(cantidadPdto_Rows[0].cantidad) + parseInt(cantidad)) > parseInt(producto_row[0].MaxReserva)) return res.json({  
        titulo : "Reserva superada",
        icon: "error",
        text : "Has superado el límite máximo de reserva"
    });
    try {
        let rows = await query(sql);
        var precioProducto = rows[0].precio;
        /* =====consulta detalle======= */
        let sqlDetalle = `INSERT INTO detalle (cantidad, valor, Estado,entregado, Persona,fecha, fk_Id_movimiento, fk_id_inventario) 
        VALUES (${cantidad}, ${precioProducto}, 'Reservado','No entregado',${persona},now(),${movimiento}, ${inventario})`;
        await query(sqlDetalle);
        
        return res.json({  
            titulo : "Registro Exitoso",
            icon: "success",
            text : "La reserva ha sido registrada con éxito"
        });
    } catch (err) {
        console.log(err)
    }
    
}
controlador.Eliminar_Detalle = async (req, res) => {
    var idDetalle = req.body.id_detalle;
    if(!req.body.id_detalle) return res.json({status: 404, message: 'Detalle no encontrado'})
    let sql = `DELETE FROM detalle where id_detalle =`+idDetalle; 
    try{
        await query(sql);
        return res.json({  
            titulo : "Producto Eliminado",
            icon: "success",
            text : "Producto eliminado de reserva"
        });
    } catch (err) {
        console.log(err);
    }
}
module.exports = controlador;