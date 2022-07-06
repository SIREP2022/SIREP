const controladorMovimiento = {};
const query = require('../database/pool-conexion')
controladorMovimiento.renderMovimientos = async (req, resp) => {
    var sql = "select * from  cargo"
    let rows = await query(sql);
    resp.render('venta/movimientos', {Datos:rows, profile:req.session.user});
};
controladorMovimiento.listarProductos = async (req, resp) => {
    try {
        let sesion_pv = req.session.user.pv;
        let sql = `select * from lista_productos where Id_punto_vent  = ${sesion_pv}`;
        let rows = await query(sql);
        resp.json(rows);
    } catch (error) {
        console.log("Error al Listar los Productos: " + error);
    }
};
/* =================controlador agregar================ */
controladorMovimiento.consAggProd = async (req, resp) => {
    var id = req.body.codigop;
    try {
        let sql = `select * from lista_productos where id_inventario=` + id;
        let rows = await query(sql);
        return resp.json(rows);
    } catch (error) {
        console.log("Error al Listar los Productos: " + error);
    }
};
/* ==================filtro busqueda clientes=============== */
controladorMovimiento.filtro = async (req, resp) => {
    var iden = req.body.iden;
    try {
        let sql = "SELECT identificacion, Cargo,Nombres FROM `personas` WHERE identificacion=" + iden;
        let rows = await query(sql);
        return resp.json(rows);
    } catch (error) {
        console.log("Error al Listar los Productos: " + error);
    }
};
controladorMovimiento.genVenta = async(req, resp) => {
    let pPersona = req.body.iden;
    let op1 = "NuevaVenta";
    let movimiento = 0;
    try {
        let sql = `CALL Administrar_Ventas('${op1}',${pPersona},'${movimiento}')`;
        let rows = await query(sql);
        return resp.json(rows[0]);
    } catch (error) {}
};
controladorMovimiento.eliminarDetalle = async (req, resp) => {
    let idDetalle = req.body.idDetalle;
    try {
        let sql = `delete from detalle where id_detalle = '${idDetalle}'; `;
        await query(sql);
        return resp.json({ status: 200 });
    } catch (error) {}
};
controladorMovimiento.agregarDetalle = async (req, resp) => {
    let cantidadProd = req.body.canProd;
    let valorProd = '';
    let estadoEntr = req.body.estadoEntega;
    let estadoProd = "Reservado";
    let comprador = req.body.comprador;
    let movimiento = req.body.movimiento;
    let sessionCaro = parseInt(req.body.codCargo);
    let inventario = req.body.id_inventario;

    if (!inventario || inventario == 'undefined') return console.log(inventario)
    try {
        let precios = `select id_inventario, aprendiz, instructor, administrativo, externo, auxiliar, stock from lista_productos where id_inventario='${inventario}'`
        let producto = `SELECT Codigo_pdto, MaxReserva, inventario FROM inventario i join productos p on i.fk_codigo_pdto = Codigo_pdto where id_inventario = '${inventario}';`
        let rows_precio = await query(precios);
        let producto_row = await query(producto);
        let stock = rows_precio[0].stock;

        if (cantidadProd > stock && producto_row[0].inventario == 'Si') return resp.json({ status: 'error', message: 'Has superado el límite de stock de este producto' })
        let cantidadPdto = `SELECT sum(cantidad) as cantidad FROM listamovimientos 
        where Id_movimiento = '${movimiento}' and Codigo_pdto = '${producto_row[0].Codigo_pdto}' and identificacion = '${comprador}';`
        let cantidadPdto_Rows = await query(cantidadPdto);
        if((parseInt(cantidadPdto_Rows[0].cantidad) + parseInt(cantidadProd)) > parseInt(producto_row[0].MaxReserva)) return resp.json({status: 'error', message: 'Has superado el límite de stock de este producto'});
        
        switch (sessionCaro) {
            case 1:
                valorProd = rows_precio[0].aprendiz;
                break;
            case 2:
                valorProd = rows_precio[0].instructor;
                break;
            case 3:
                valorProd = rows_precio[0].administrativo;
                break;
            case 4:
                valorProd = rows_precio[0].externo;
                break;
            case 5:
                valorProd = rows_precio[0].auxiliar;
                break;
            default:
                break;
        }
        let sql = `insert into detalle(cantidad, valor, Estado, Entregado, fecha, Persona, fk_Id_movimiento, fk_id_inventario)
        values(${cantidadProd},${valorProd}, '${estadoProd}','${estadoEntr}',now(), ${comprador},${movimiento}, ${inventario})`;
        await query(sql);
        return resp.json({
            status: 200,
            message: 'Registro realizado exitosamente'
        })
    } catch (error) {
        console.log(error);
    }
};
controladorMovimiento.listarPreciosProductos = async (req, resp) => {
    let sesion_pv = req.session.user.pv;
    let sql = `select id_inventario as codigo, 
    Producto, stock, aprendiz, estado, instructor, administrativo,externo, auxiliar 
    from lista_productos where Id_punto_vent = '${sesion_pv}' and tipo = 'venta';`;
    try {
        let rows = await query(sql);
        resp.json(rows);
    } catch (error) {
        console.log(error)
    }
}
/* ================segunda parte==================== */
/* =====================lista los detalles de reserva================== */
controladorMovimiento.listarMovimientos = async (req, resp) => {
    let sesion_punto = req.session.user.pv
    try {
        let sql = `select m.Id_movimiento,date_format(m.Fecha, "%d-%m-%Y") as Fecha , m.Estado,
        (select Nombres from personas where m.fk_persona=personas.identificacion)as personas, 
        m.fk_persona as identificacion,
        (select sum(valor * cantidad) from detalle where fk_Id_movimiento = m.Id_movimiento) as total, 
        (SELECT COUNT(*) FROM detalle where m.Id_movimiento = detalle.fk_Id_movimiento) as detalles 
        from movimientos m LEFT JOIN detalle d ON d.fk_Id_movimiento = m.Id_movimiento 
        LEFT JOIN inventario i on i.id_inventario = d.fk_id_inventario 
        where (m.estado='Reservado' or m.estado='Facturado') and i.fk_id_punto_vent = '${sesion_punto}' 
        GROUP BY Id_movimiento`;
        let rows = await query(sql);
        resp.json(rows);
    } catch (error) {
        console.log('Error al Listar los Movimientos: ' + error);
    }
}
/* ==============controlador de los detalles============================= */
controladorMovimiento.mostrarDetalle = async (req, resp) => {
    var id_movimiento = req.params.idmovimiento;
    var sesion_punto = req.session.user.pv;
    let sql = `SELECT Codigo_pdto, id_detalle, producto as Nombre, cantidad as Cantidad, 
    identificacion, Nombres, valor as VlrUnit, subtotal as VlrTotal, Estado as EstadoVenta, 
    Entregado, num_factura
    FROM listamovimientos where Id_movimiento = '${id_movimiento}' and id_punto_vent = '${sesion_punto}'`;
    try {
        let rows = await query(sql);
        resp.json(rows);
    } catch (error) {
        console.log('Error al Listar  el Detalle: ' + error);
    }
}



/* =================boton editar==================== */
controladorMovimiento.botonModaleditar  = async (req, resp) => {
    var codigoProducto = req.body.Codigo_pdto;
    var sql ="SELECT id_detalle, nombre,codigo_pdto,cantidad,detalle.Entregado as estadetalle FROM detalle JOIN inventario ON fk_id_inventario=id_inventario JOIN productos ON Codigo_pdto=fk_codigo_pdto where id_detalle="+codigoProducto;
    let rows = await query(sql);
    resp.json(rows[0]); 
}
/*===============editar================*/
controladorMovimiento.editar = async (req, resp) => {
    var idDetalle = req.body.codigo_pdto;
    var cantidad = req.body.cantidad;
    var entregado = req.body.estado;   
    try{
        var sql = `UPDATE detalle SET cantidad =${cantidad},Entregado='${entregado}' WHERE detalle.id_detalle=`+idDetalle;
        let rows = await query(sql);
        resp.json(rows);   
    }catch{
        console.log(error)
    }
} 
/* =======================estado farcturado movimiento============== */
controladorMovimiento.CambiarEstado = async (req, resp) => {
    let op1 = "FacturarVenta";
    let pPersona = req.body.iden;
    let movimiento =req.body.Id_movimiento;
    try {
        let sql = `CALL Administrar_Ventas('${op1}',${pPersona},'${movimiento}')`;
        let rows = await query(sql);
        return resp.json(rows[0]);
    } catch (error) {}
};
controladorMovimiento.AnularMovimiento = async (req, resp) => {
    let movimiento = req.body.Id_movimiento;
    try {
        let sql = `update movimientos set Estado = 'Anulado' where Id_movimiento = '${movimiento}';`;

        let sql_movimiento = `SELECT Codigo_pdto, id_detalle, producto as Nombre, cantidad as Cantidad, 
        identificacion, Nombres, valor as VlrUnit, subtotal as VlrTotal, Estado as EstadoVenta, 
        Entregado, num_factura
        FROM listamovimientos where Id_movimiento = '${movimiento}'`;
        let detalles = await query(sql_movimiento);
        detalles.forEach(async(e) => {
            var sql_detalle_anular =  `CALL Administrar_Detalle_Venta('AnularDetalle','${e.id_detalle}')`;
            await query(sql_detalle_anular);
        });
        await query(sql);
        return resp.json({
            status: 200,
            message: 'Movimiento anulado con éxito'
        })
    } catch (error) {
        console.log(error)
    }
}
/* ===================EstadoFacturado detalle====================== */
controladorMovimiento.EstadoFacturado  = async (req, resp) => {
    var id_detalle = req.body.id_detalle;
    var sql =  `CALL Administrar_Detalle_Venta('FacturarDetalle','${id_detalle}')`;
    try{
        let rows = await query(sql);
        resp.json(rows[0]);
    } catch (error) {
        console.log(error);
    }
}
controladorMovimiento.EstadoAnulado =  async (req, resp) => {
    var id_detalle = req.body.id_detalle;
    var sql =  `CALL Administrar_Detalle_Venta('AnularDetalle','${id_detalle}')`;
    try{
        let rows = await query(sql);
        resp.json(rows[0]);
    } catch (error) {
        console.log(error);
    }
}

/* ===============finalizar compra ==================================== */
controladorMovimiento.endCompra  = async (req, resp) => {
    var sql = `SELECT * FROM detalle WHERE Estado = 'Facturado'`;
    try{
        let rows = await query(sql);
        resp.json(rows);
    } catch(err){
        console.log(err);
    }
}


controladorMovimiento.validarAdmin  = async (req, resp) => {
    var sql = `select identificacion from personas WHERE Login = '${req.body.login}' 
    and Password = '${req.body.password}'`;
    try{
        let rows = await query(sql);
        if(rows.length > 0) return resp.json({status: '200', message: 'Usuaro admin autorizado'});
        else return resp.json({status: 'error_auth', message: 'Usuario admin no autorizado'})
    } catch(e){
        console.error(e);
    }
}

module.exports = controladorMovimiento;