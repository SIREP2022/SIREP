const controlador = {};
const query = require('../database/pool-conexion');


const multer = require('multer-js');

const storage = multer.diskStorage({
    destination: function(req, img, cb) {
        cb(null, "public/img/products");
    },
    filename: function(req, img, cb) {
        const datoahora = Date.now();
        req.fileNewName = datoahora + img.originalname;
        cb(null, req.fileNewName);
    }
});

const upload = multer({ storage: storage });
controlador.CargarImagen = upload.single('img');

controlador.Vista = async (req, res) => {
    try{
        let sql = "select * from unidades_productivas";
        let rows = await query(sql);
        res.render('admin/productos',{Unidadesproductivas:rows, profile: req.session.user})
    }
    catch(e){
        console.log(e);
    }
};
controlador.RegistrarProductos = async (req, res) => {
    try{
        let nombre = req.body.Nombrepdto;
        let imagen = req.fileNewName;
        if(!imagen) imagen ='logoSena.png'
        let up = req.body.unidapdtopdto;
        let Descripcion = req.body.Descripcionpdto;
        let tipo = req.body.tipopdto;
        let Reserva = req.body.Reservapdto;
        let Maximo = req.body.Maximopdto;
        let horastart = req.body.horainicio;
        let horaend = req.body.horafin;
        let inventario = req.body.inventario;
        let estado = req.body.Estadopdto;
        let sql = `insert into productos(Nombre,Descripcion,imagen,Estado,Reserva,MaxReserva,Tipo,fk_codigo_up,hora_inicio,hora_fin,inventario) 
            values('${nombre}','${Descripcion}','${imagen}','${estado}','${Reserva}','${Maximo}','${tipo}','${up}','${horastart}','${horaend}','${inventario}')`;
        
        await query(sql);
        return res.json({  
            titulo : "Registro Exitoso",
            icono: "success",
            mensaje : "El Producto Registrado con éxito",
            timer : 2000
        });
    }
    catch(e){
        console.log(e)
    }
};

controlador.ListaProductos = async (req, res) => {
    try{
        var sql = "select p.Codigo_pdto as Codigo_pdto, p.Nombre as Nombre_pdto, p.imagen as Imgpdto, up.nombre as Nombre_up, p.Descripcion as Descripcion, p.Estado as Estado, p.Reserva as Reserva, p.MaxReserva as MaxReserva, p.tipo as tipo, if( p.hora_inicio is null,'00::00:00',p.hora_inicio) as hora_inicio, if( p.hora_fin is null,'00:00:00',p.hora_fin) as hora_fin, if(p.inventario is null,'No',p.inventario) as inventario from productos p join unidades_productivas up on codigo_up = fk_codigo_up order by Codigo_pdto asc";
        let rows = await query(sql);
        res.json(rows);
    }
    catch(e){
        console.log(e)
    }
};

controlador.buscarpdto = async (req, res) =>{
    try{
        var identificador = req.body.Identificacion;
        let sql = 'select p.Codigo_pdto as Codigo_pdto, p.Nombre as Nombre, p.Descripcion as Descripcion, p.Estado as Estado, p.Reserva as Reserva, p.MaxReserva as MaxReserva, p.fk_codigo_up as fk_codigo_up, p.tipo as tipo, p.hora_inicio as hora_inicio, p.hora_fin as hora_fin, p.inventario as inventario from productos p  where Codigo_pdto='+identificador;
        let rows = await query(sql);
        res.json(rows);
    }
    catch(e){
        console.log(e);
    };  
};
controlador.Actualizarproductos = async (req, res) =>{
    try{
        let id = req.body.Identificacionact;
        let nombre = req.body.Nombrepdtoact;
        let img = req.fileNewName;
        if(!img) img ='logoSena.png'
        let up = req.body.unidapdtopdtoact;
        let Descripcion = req.body.Descripcionpdtoact;
        let tipo = req.body.tipopdtoact;
        let Reserva = req.body.Reservapdtoact;
        let Maximo = req.body.Maximopdtoact;
        let horastart = req.body.horainicioact;
        let horaend = req.body.horafinact;
        let inventario = req.body.inventarioact;
        let estado = req.body.Estadopdtoact;
        let sql = `update productos set Nombre='${nombre}',
        Descripcion='${Descripcion}',
        imagen='${img}',
        Estado='${estado}',
        Reserva='${Reserva}',
        MaxReserva='${Maximo}',
        Tipo='${tipo}',
        fk_codigo_up='${up}',
        hora_inicio='${horastart}',
        hora_fin='${horaend}',
        inventario='${inventario}'
        where Codigo_pdto='${id}'`;

        await query(sql);
        return res.json({  
            titulo : "Actualizado con Exito",
            icono: "success",
            mensaje : "El Producto ha sido Actualizado con éxito",
            timer : 2000
        });
    }
    catch(e){
        console.log(e);
    };
};

controlador.ListarPrecios = async (req, res) =>{
    try{
        let codigopdto = req.body.idpdto;
        console.log(codigopdto)
        let sql = "select precios.id_precio as id_precio, cargo.nombre_cargo as cargonombre, precios.precio as preciopdto, productos.Nombre as nombrepdto, precios.fk_producto as fk_producto, precios.fk_cargo as fk_cargo, productos.Codigo_pdto as Codigo_pdto from cargo join precios on idcargo=fk_cargo join productos on fk_producto=Codigo_pdto where Codigo_pdto="+codigopdto;
        let rows = await query(sql); 
        res.json(rows);
    }
    catch(e){
        console.log(e)
    }
}; 

controlador.RegistrarPrecios = async (req, res)=>{
    try{
        let pdto = req.body.pdto;
        let cargo = req.body.cargo;
        let precio = req.body.precio;
        let sql =`insert into precios(fk_producto,fk_cargo,precio) values('${pdto}','${cargo}','${precio}')`;              
        await query(sql);
        return res.json({  
            titulo : "Registro Exitoso",
            icono: "success",
            mensaje : "El Precio ha sido Registrado con éxito",
            timer : 2000
        });
    }
    catch(e){
        console.log(e)
    }
}

controlador.BuscarPrecio = async (req, res)=>{
    try{
        var idpdto = req.body.Codigopdto;
        let sql = 'select * from productos  where codigo_pdto='+idpdto;
        let rows = await query(sql);
        res.json(rows); 
    }
    catch(e){
        console.log(e);
    }; 
}

controlador.Mostrarprecio = async (req, res)=>{
    try{
        var idsale = req.body.idsale;
        let sql = 'select * from precios  where id_precio='+idsale;
        let rows = await query(sql);
        res.json(rows);  
    }
    catch(e){
        console.log(e);
    }; 
}
controlador.ActualizarSale = async (req, res)=>{
    try{
        let idpdtosale = req.body.idpdto;
        var idsale = req.body.idsale;
        let cargosale = req.body.preciosale;
        let preciosale = req.body.cargosale;
        let sql = `update precios set  precio='${cargosale}',
        fk_producto='${idpdtosale}',
        fk_cargo='${preciosale}'
        where id_precio='${idsale}'`;

        await query(sql);

        return res.json({  
            titulo : "Actualizado con Exito",
            icono: "success",
            mensaje : "El Precio ha sido Actualizado con éxito",
            timer : 5000
        });
    }
    catch(e){
        console.log(e);
    }; 
}

module.exports = controlador;