const controlador = {};
const query = require('../database/pool-conexion');

//=============Controlador para listar produccion================
controlador.Listar_Produccion = async (req,res)=>{
    try{
        var idup = req.body.unidad;
        var sql = `select Id_produccion,Cantidad,DATE_FORMAT(produccion.fecha,'%d-%m-%Y') as fecha,Observacion, productos.Nombre from produccion join productos on Codigo_pdto = fk_codigo_pdto where fk_codigo_up='${idup}'`;
        let rows = await query(sql);
        return res.json(rows);
    }
    catch(e){
         console.log(e)
    }
}
// ======================= Listar Productos =================================
controlador.llamarproductos = async(req,res)=>{
    let  unidadproductiva = req.body.codigoup;
    let sql = `select unidades_productivas.Nombre as nameup, productos.Nombre as Namepdto, productos.Codigo_pdto as Codigo_pdto  from productos join unidades_productivas on codigo_up=fk_codigo_up where fk_codigo_up ='${unidadproductiva}'`; 
    let rows = await query(sql);
    res.json(rows);
}
// =========== listar Unidad Productiva==================
controlador.Produccion = async (req,res)=>{
    sql = 'select Nombre,codigo_up from unidades_productivas where estado = "Activo";' // unidades productivas 
    let rows = await query(sql);
    res.render('admin/produccionUp.ejs',{up:rows, profile: req.session.user});
}

//=============registrar produccion =======================

controlador.RegistrarProduccion = async (req,res)=>{
    let cant = req.body.Cantidad;
    let obs= req.body.Observacion;
    let fkp = req.body.fkp;

    let sql= `insert into produccion(Cantidad,Observacion,fecha,fk_codigo_pdto)
    values('${cant}','${obs}',CURDATE(),'${fkp}')`;
    await query(sql);
    return res.json({
        titulo: "Registro exitoso",
        icono: "success",
        mensaje: "La producción fue registrada con éxito"
    })
}

/*===========editar produccion============== */

controlador.Buscarproduccion = async (req,res)=>{
    try{
        let id_produccion = req.body.idproduccion;
        let sql = `select id_produccion, Cantidad, Nombre, observacion from produccion join productos on Codigo_pdto=fk_codigo_pdto where id_produccion ='${id_produccion}'`;
        let rows = await query(sql);
        res.json(rows);
    }
    catch(err){
        console.log(err);
    }
}

controlador.editarProduccion = async (req,res)=>{
    let id= req.body.idproducc;
    let cant = req.body.Cantidad;
    let obs= req.body.Observacion;
    let sql= `update produccion set Cantidad='${cant}',Observacion='${obs}',fecha=CURDATE() where Id_produccion = '${id}'`;
    await query(sql);
    return res.json({
        titulo: "Actualización exitosa",
        icono: "success",
        mensaje: "La producción fue actualizada con éxito"
    })
}

module.exports = controlador;