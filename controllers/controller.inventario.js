const query = require('../database/pool-conexion');
const controlador = {};

controlador.Vista = async (req, res) => {
    try{
        var sql = "select * from productos";
        let productos = await query(sql);

        var sql1 = "select * from punto_venta";
        let punto_venta = await query(sql1);
        
        res.render('inventario/inventario',{Datos:punto_venta, Productos:productos, PVenta:punto_venta, profile: req.session.user})
    }
    catch(e){
        console.log(e);
    }
};
controlador.ListaInventario = async (req, res) => {
    try{
        var sql = "select id_inventario,stock,fk_codigo_pdto,fk_id_punto_vent, punto_venta.Nombre as nombrePunto, productos.Nombre as nombrePdto, productos.Codigo_pdto as Codigo_pdto, punto_venta.Id_punto_vent as Id_punto_vent  from productos INNER JOIN inventario on fk_codigo_pdto=Codigo_pdto INNER JOIN punto_venta ON Id_punto_vent=fk_id_punto_vent";
        let rows = await query(sql);
        res.json(rows);
    }
    catch(e){
        console.log(e);
    } 
};
controlador.registrarInventario = async (req, res)=>{
    try{
        let stock = req.body.stock;
        let pdto = req.body.pdto;
        let Pvent = req.body.Pventa;
        var sql = `insert into inventario(stock,fk_codigo_pdto,fk_id_punto_vent)values('${stock}','${pdto}','${Pvent}')`;
        await query(sql);
        return res.json({  
            titulo : "Registro Exitoso",
            icono: "success",
            mensaje : "El inventario ha sido regsitrado con éxito"
        });
    }catch(e){
       console.log(e);
    }
}
controlador.BuscarInvent = async (req, res)=>{
    try{
        var identificador = req.body.Identificacion;
        let sql = 'select * from  inventario where id_inventario='+identificador;
        let rows = await db.query(sql);
        res.json(rows);       
    }
    catch(e){
        console.log(e);
    }  
};

controlador.pdtoinventario = async (req, res)=>{
    try{
        let dtoinventario = req.body.idptoinve;
        let sql =`select * from productos  where codigo_pdto=`+dtoinventario;
        let rows = await query(sql);
        res.json(rows); 
    }
    catch(e){
        console.log(e);
    }
}

controlador.ListaProduccion = async (req, res)=>{
    try{
        let idprdto = req.body.idptoibv;
        let sql =`SELECT lup.Id_produccion,date_format(lup.fecha, "%d-%m-%Y") as fecha,lup.codigo_pdto,lup.producto,lup.Producido,if(lup.distribuido is null,0,Distribuido) as Distribuido,if (lup.Disponible is null,0,Disponible) as Disponible FROM lista_produccion_up lup
        where lup.codigo_pdto='${idprdto}'`;
        let rows = await query(sql);
        res.json(rows); 
    }
    catch(e){
        console.log(e);
    }
}

controlador.ListarBodega = async (req, res)=>{
    try{
        let idproduccion = req.body.idproducci;
        let sql =`select punto_venta.Nombre as Nombrepunt, bodega.id_bodega as id_bodega, date_format(bodega.fecha, "%d-%m-%Y") as fechabodega, bodega.cantidad as cantidadbodega from produccion  join bodega on fk_produccion=Id_produccion join inventario on fk_inventario=id_inventario join punto_venta on fk_id_punto_vent=Id_punto_vent where fk_produccion='${idproduccion}'`;
        let rows = await query(sql);
        res.json(rows); 
    }
    catch(e){
        console.log(e);
    }
}

controlador.Nombrepunt = async (req, res)=>{
    try{
        let idputv = req.body.idpunto;
        let sql =`select inventario.id_inventario as id_inventario, productos.Nombre as nombrepdto, punto_venta.Nombre as nombrepuntv from productos join inventario on fk_codigo_pdto=Codigo_pdto join punto_venta on Id_punto_vent=fk_id_punto_vent where id_inventario='${idputv}'`;
        let rows = await query(sql);
        res.json(rows); 
    }
    catch(e){
        console.log(e);
    }
}

controlador.valoresproduccion = async (req, res)=>{
    try{
        let idproduccion = req.body.idproduccion;
        let sql =`SELECT lup.id_produccion,lup.disponible FROM lista_produccion_up lup where id_produccion='${idproduccion}'`;
        let rows = await query(sql);
        res.json(rows); 
        
    }
    catch(e){
        console.log(e);
    }
}
controlador.Actualizarinventario = async(req, res)=>{
    try{
        let operacion = req.body.operacion;
        let cantidad = req.body.cantidad;
        let fkproduccion  = req.body.fk_produccion;
        let fkinventario = req.body.fk_inventario;

        let validacion = await query(`select Distribuido,  Disponible, Producido from lista_produccion_up where Id_produccion = '${fkproduccion}'`);
        let distribucion = validacion[0].Distribuido;
        let disponibles = validacion[0].Disponible;
        let produccion = validacion[0].Producido;
        let cantidades = null
        if(distribucion == cantidades && disponibles == cantidades){
            if( cantidad > produccion ){
                return res.json({  
                    titulo : "Atención",
                    icono: "warning",
                    mensaje : "Sobrepasa el stock Producido",
                    timer : 1800
                });
            } 
        }
        if(distribucion != cantidades && disponibles != cantidades){
            if(cantidad > disponibles){
                return res.json({  
                    titulo : "Atención",
                    icono: "warning",
                    mensaje : "Sobrepasa el Stock Disponible",
                    timer : 1800
                });
            }

        }
        let sql = `CAll Administrar_inventario('${operacion}',${cantidad},${fkproduccion},${fkinventario})`;
        await query(sql);
        return res.json({  
            titulo : "Actualizado con Exitoso",
            icono: "success",
            mensaje : "El Inventario ha sido Actulizado con éxito",
            timer : 2000
        });
        
    }
    catch(e){
        console.log(e);
    }
}
module.exports = controlador;