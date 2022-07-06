const query = require('../database/pool-conexion')
const controlador = {};
/* ==================select del cargo================ */
controlador.renderRegistroCliente  = async (req, res) =>{
    var sql = "select * from  cargo"
    try {
        let rows = await query(sql);
        return res.render('admin/registro-cliente', {Datos:rows, profile: req.session.user})
    } catch(e) {
        console.log(e)
    }
}
/* ==================listar usuarios================= */
controlador.Listar_Usuarios = async (req, res)=>{
    var sql = `SELECT identificacion,Nombres,Correo,Direccion,Telefono,Ficha,nombre_cargo as Cargo, Rol, if (Estado=1,'Activo','Inactivo') as Estado FROM personas join cargo on Cargo=cargo.idcargo where Rol != 'Admin'`;
    try{
        let rows = await query(sql);
        return res.json(rows);
    } catch(e){
        console.log(e);
    }
}

/* ==================registrar============= */
controlador.RegistroCliente = async (req,res)=>{
    let ide = req.body.identificacion;
    let nomb = req.body.nombre;
    let corre = req.body.correo;
    let direccion = req.body.direccion;
    let telefono = req.body.telefono;
    let ficha = req.body.ficha;
    let cargo = req.body.cargo;
    let rol = req.body.rol;
    if(cargo != 1) ficha = 0;
    let estado = req.body.estado;
    
    let user = req.body.user;

    // PASSWORD ENCRYPT
    let pas = ide;
    /*==================== inyeccion sql============ */
     var sql = `insert into personas(identificacion,Nombres,Correo,Login,Password,Direccion,Telefono,Ficha,Cargo,Rol,Estado)
     values(${ide},'${nomb}','${corre}','${user}','${pas}','${direccion}','${telefono}','${ficha}','${cargo}','${rol}','${estado}')`;

    try{
        await query(sql);
        return res.json({status:200, msg: 'Registrado con Exito'});
    }catch(e){
        return res.json({status:400, msg: 'Error'+e});
    }
};

/* ================Actualizar=========== */
controlador.buscar = async (req,res)=>{
    var iden = req.body.identificacion;
    var sql ="select * from personas where identificacion="+iden;
    try{
        let rows = await query(sql);
        return res.json(rows[0]);
    } catch(e){
        console.log(e);
    }
    
}
/* botonactualizar */
controlador.actualizar = async (req,res)=>{
    let ide = req.body.identificacion;
    let nomb = req.body.nombre;
    let corre = req.body.correo;
    let direc = req.body.direccion;
    let tel = req.body.telefono;
    let ficha = req.body.ficha;
    let cargo = req.body.cargo;
    let rol = req.body.rol;
    let estado = req.body.estado;
    if(!ficha) ficha = 0;
    if(cargo != 1) ficha = 0;
    
    // PASSWORD ENCRYPT
    let pass = ide;
    var sql = `update  personas set 
    Password = '${pass}',
    identificacion=${ide},Nombres='${nomb}',Correo='${corre}',Direccion='${direc}',Telefono='${tel}',Ficha='${ficha}',Cargo='${cargo}',Rol='${rol}',Estado='${estado}' where identificacion=${ide}`;
   try{
       await query(sql);
       return res.json({status:200, msg: 'Usuario actualizado con éxito'});
   }catch(e){
       return res.json({status:400, msg: 'Error'+e});
   }
}
module.exports = controlador;


/*      =========    ======== ======= ======
        =       =   =       = =======  = =    =
        =         =         = =     = =    =*/