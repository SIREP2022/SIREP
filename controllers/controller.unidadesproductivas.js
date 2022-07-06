const query = require("../database/pool-conexion");
const multer = require('multer-js');
const controlador = {};

const storage = multer.diskStorage({
    destination: function(req, img, cb) {
        cb(null, "public/img/uds");
    },
    filename: function(req, img, cb) {
        const datoahora = Date.now();
        req.fileNewName = datoahora + img.originalname;
        cb(null,req.fileNewName );
    }
});

const upload = multer({ storage: storage });
controlador.CargarImagen = upload.single('img');

controlador.Vista = async (req, res) => {
    try{
        let sql = "select * from personas where Rol = 'Lider UP';";
        let rows = await query(sql);
        res.render('admin/unidadesproductivas',{Personas:rows, profile: req.session.user})
    }
    catch(e){
        console.log(e);
    }
};

controlador.RegistrarUnidadProductiva = async (req, res) => {
    try{
        let nombre = req.body.Nombre;
        let logo = req.fileNewName;
        if(!logo) logo ='ud.png'
        let Descripcion = req.body.Descripcion;
        let Sede = req.body.Sede;
        let Estado = req.body.Estado;
        let Entrega = req.body.Entrega;
        let Persona = req.body.PersonaEncargada;
        let sql = `insert into unidades_productivas(Nombre,Logo,Descripcion,sede,estado,entrega_producto,fk_persona, fk_sena_empresa) 
                  values('${nombre}','${logo}','${Descripcion}','${Sede}','${Estado}','${Entrega}','${Persona}', 1)`;
        
        await query(sql)
        return res.json({  
            titulo : "Registro Exitoso",
            icono: "success",
            mensaje : "La Unidad Productiva ha sido Registrada con éxito",
            timer : 2000
        });
    }
    catch(e){
        console.log(e);
    }
        
};
controlador.Buscarunidadproductiva = async (req, res)=>{
    try{
        var identificador = req.body.Identificacion;
        let sql = 'select up.codigo_up as codigo_up, up.Nombre as Nombre, up.Descripcion as Descripcion, up.sede as sede, up.estado as estado, up.entrega_producto as entrega_producto, up.fk_persona as fk_persona from unidades_productivas  up  where codigo_up='+identificador;
        let rows = await query(sql);
        res.json(rows); 
    }
    catch(e){
        console.log(e)
    }  
};

controlador.ListaUnidadesProductivas = async (req, res) => {
    try{
        var sql = "select * from unidades_productivas join personas on identificacion=fk_persona order by codigo_up Asc;";
        let rows = await query(sql);
        res.json(rows);
    }
    catch(e){
        console.log(e);
    }
};

controlador.ActualizarUnidadProductiva = async (req, res) =>{
    try{
        let id = req.body.Identificacion;
        let nombre = req.body.Nombre;
        let logo = req.fileNewName;
        if(!logo) logo ='ud.png'
        let Descripcion = req.body.Descripcion;
        let Sede = req.body.Sede;
        let Estado = req.body.Estado;
        let Entrega = req.body.Entrega;
        let Persona = req.body.PersonaEncargada;
        let sql = `update unidades_productivas set Nombre='${nombre}', Logo='${logo}',Descripcion='${Descripcion}',sede='${Sede}',estado='${Estado}',entrega_producto='${Entrega}',
        fk_persona='${Persona}' where codigo_up='${id}'`;

        await query(sql)
        return res.json({  
            titulo : "Actualizado con Éxito",
            icono: "success",
            mensaje : "La Unidad Productiva ha sido Actualizada con Éxito",
            timer : 2000
        });
    }
    catch(e){
        console.log(e);
    }
}

module.exports = controlador;