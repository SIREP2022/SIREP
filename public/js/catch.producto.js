window.onload = ListaProductos();
var modalproductosregistro = new bootstrap.Modal(document.getElementById('modalpdtoregistro'), {
    keyboard: false
});
var modalproductosactualizar = new bootstrap.Modal(document.getElementById('modalpdtoactual'), {
    keyboard: false
});
var modalprecioregistro = new bootstrap.Modal(document.getElementById('modalprecioregistro'), {
    keyboard: false
});

function MostrarRegistroproductos() {
    modalproductosregistro.show();
}

function MostrarProductoseleccionado() {
    modalproductosactualizar.show();
}
/*Validacion del campo de descuento*/
let campoDescuento = document.getElementById('descCont').value;
if (campoDescuento == 'Activo') {


}


/* =================================================== */
function RegistrarProducto() {
    let form = document.getElementById('form_registro_productos');
    let nombrepdto = document.getElementById('nombreproducto').value;
    let FileN = document.getElementById('fileNpdto');
    let uppdto = document.getElementById('unidadproductiva').value;
    let descripcionpdto = document.getElementById('descripcionproducto').value;
    let tipo = document.getElementById('tipoproducto').value;
    let reservapdto = document.getElementById('reservaproducto').value;
    let maximopdto = document.getElementById('reservamaxima').value;
    let horainicio = document.getElementById('horainicio').value;
    let horafin = document.getElementById('horafin').value;
    let inventario = document.getElementById('controlinventario').value;
    let estadopdto = document.getElementById('estadoproducto').value;
    let medida = document.getElementById('medida').value;
    let promocion = document.getElementById('promocion').value;
    let porcentaje = document.getElementById('porcentaje').value;
    let reserva_grupal = document.getElementById('res_grupal').value;

    var DatosFormData = new FormData();
    DatosFormData.append('Nombrepdto', nombrepdto);
    DatosFormData.append('img', FileN.files[0]);
    DatosFormData.append('unidapdtopdto', uppdto);
    DatosFormData.append('Descripcionpdto', descripcionpdto);
    DatosFormData.append('tipopdto', tipo);
    DatosFormData.append('Reservapdto', reservapdto);
    DatosFormData.append('Maximopdto', maximopdto);
    DatosFormData.append('horainicio', horainicio);
    DatosFormData.append('horafin', horafin);
    DatosFormData.append('inventario', inventario);
    DatosFormData.append('Estadopdto', estadopdto);
    DatosFormData.append('medida', medida);
    DatosFormData.append('promocion', promocion);
    DatosFormData.append('porcentaje', porcentaje);
    DatosFormData.append('reserva_grupal', reserva_grupal);

    fetch('/Registrar_pdto', {
        method: 'post',
        body: DatosFormData,
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    }).then(res => res.json())
        .then(data => {
            if (data.status == 401) return console.log(data)
            Swal.fire({
                title: data.titulo,
                icon: data.icono,
                text: data.mensaje,
                timer: data.timer
            })
            form.reset();
            modalproductosregistro.hide();
            ListaProductos();
        });
};
function Actaulizarpdto() {
    let identi = document.getElementById('id_pdto').value;
    let nombrepdto = document.getElementById('nombreproductoact').value;
    let FileN = document.getElementById('fileNact');
    let uppdto = document.getElementById('unidadproductivaact').value;
    let descripcionpdto = document.getElementById('descripcionproductoact').value;
    let tipo = document.getElementById('tipoproductoact').value;
    let reservapdto = document.getElementById('reservaproductoact').value;
    let maximopdto = document.getElementById('reservamaximaact').value;
    let horainicio = document.getElementById('horainicioact').value;
    let horafin = document.getElementById('horafinact').value;
    let inventario = document.getElementById('controlinventarioact').value;
    let estadopdto = document.getElementById('estadoproductoact').value;
    let medidapdto = document.getElementById('medidaact').value;
    let promocionpdto = document.getElementById('promocionact').value;
    let porcentajepdto = document.getElementById('porcentajeact').value;
    let reserva_grupal = document.getElementById('res_grupal_act').value;


    var DatosFormData = new FormData();
    DatosFormData.append('Identificacionact', identi)
    DatosFormData.append('Nombrepdtoact', nombrepdto);
    DatosFormData.append('img', FileN.files[0]);
    DatosFormData.append('unidapdtopdtoact', uppdto);
    DatosFormData.append('Descripcionpdtoact', descripcionpdto);
    DatosFormData.append('tipopdtoact', tipo);
    DatosFormData.append('Reservapdtoact', reservapdto);
    DatosFormData.append('Maximopdtoact', maximopdto);
    DatosFormData.append('horainicioact', horainicio);
    DatosFormData.append('horafinact', horafin);
    DatosFormData.append('inventarioact', inventario);
    DatosFormData.append('Estadopdtoact', estadopdto);
    DatosFormData.append('medidapdtoact', medidapdto);
    DatosFormData.append('promocionact', promocionpdto);
    DatosFormData.append('porcentajeact', porcentajepdto);
    DatosFormData.append('reserva_grupal', reserva_grupal);

    fetch('/Actual_pdto', {
        method: 'post',
        body: DatosFormData,
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    }).then(res => res.json())
        .then(data => {
            if (data.status == 401) return console.log(data)
            Swal.fire({
                title: data.titulo,
                icon: data.icono,
                text: data.mensaje,
                timer: data.timer
            });
            ListaProductos();
            modalproductosactualizar.hide();
        });
};

function ListaProductos() {
    fetch('/Lista_pdto', {
        method: 'get',
        headers: {'Authorization': 'Bearer ' + token,}
    })
    .then(res => res.json())
    .then(data => {
        if (data.status == 401) return console.log('No autorizado');
        renderTableProductos(data)
    })
}

function Buscarproductos(ident) {
    modalproductosactualizar.show();
    var datos = new URLSearchParams();
    datos.append('Identificacion', ident);
    fetch('/Buscar_pdto', {
        method: 'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    }).then(res => res.json())
        .then(data => {
            if (data.status == 401) return console.log(data)
            data.forEach(pdto => {
                document.getElementById('id_pdto').value = pdto.Codigo_pdto;
                document.getElementById('nombreproductoact').value = pdto.Nombre;
                document.getElementById('unidadproductivaact').value = pdto.fk_codigo_up;
                document.getElementById('descripcionproductoact').value = pdto.Descripcion;
                document.getElementById('tipoproductoact').value = pdto.tipo;
                document.getElementById('reservaproductoact').value = pdto.Reserva;
                document.getElementById('reservamaximaact').value = pdto.MaxReserva;
                document.getElementById('horainicioact').value = pdto.hora_inicio;
                document.getElementById('horafinact').value = pdto.hora_fin;
                document.getElementById('controlinventarioact').value = pdto.inventario;
                document.getElementById('estadoproductoact').value = pdto.Estado;
                document.getElementById('medidaact').value = pdto.medidas;
                document.getElementById('promocionact').value = pdto.promocion;
                document.getElementById('porcentajeact').value = pdto.porcentaje;
                document.getElementById('res_grupal_act').value = pdto.reserva_grupal;
            });
        });
};



/* =============================================================================*/
function Buscarpstoprecio(codgiopdto) {
    modalprecioregistro.show();
    Listarprecios(codgiopdto)
    let form = document.getElementById('form_sale');
    var datos = new URLSearchParams();
    datos.append('Codigopdto', codgiopdto);
    fetch('/buscar_sale', {
        method: 'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    }).then(res => res.json())
        .then(data => {
            if (data.status == 401) return console.log(data)
            data.forEach(pdtosale => {
                document.getElementById('id_pdto_sale').value = pdtosale.Codigo_pdto;
                let name = value = pdtosale.Nombre
                document.getElementById('idnombreproducto').innerHTML = name;
            });

        });
    form.reset();
}

function Listarprecios(pdtoid) {
    let datosbussale = new URLSearchParams;
    datosbussale.append("idpdto", pdtoid)
    fetch('/Listar_precios', {
        method: 'post',
        body: datosbussale,
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    }).then(res => res.json())
        .then(data => {
            if (data.status == 401) console.log(data);
            let json = [];
            let array = {}
            data.forEach(element => {
                array = {
                    "col-1": element.cargonombre,
                    "col-2": element.nombrepdto,
                    "col-3": element.preciopdto,
                    "col-4": "<a class='btn btn-edit' onclick='ObtenerPrecio(" + element.id_precio + ")';>Editar</a>"
                }
                json.push(array);
            });
            $('#tablaprecios').DataTable({
                "paging": true,
                "processing": true,
                "responsive": true,
                "destroy": true,
                "data": json,
                dom: 'Bfrtip',
                columns: [
                    { "data": "col-1" },
                    { "data": "col-2" },
                    { "data": "col-3" },
                    { "data": "col-4" }
                ]
            })
        });
}

function RegistrarPrecio() {
    let form = document.getElementById('form_sale');
    let id = document.getElementById('id_pdto_sale').value;
    let precio = document.getElementById('precioproducto').value;
    let encargadp = document.getElementById('cargo').value;
    var DatosFormData = new URLSearchParams();
    DatosFormData.append('pdto', id);
    DatosFormData.append('precio', precio);
    DatosFormData.append('cargo', encargadp);
    fetch('/Registrar_precio', {
        method: 'post',
        body: DatosFormData,
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    }).then(res => res.json())
        .then(data => {
            if (data.status == 401) return console.log(data)
            Listarprecios(id);
            Swal.fire({
                title: data.titulo,
                icon: data.icono,
                text: data.mensaje,
                timer: data.timer
            });
            form.reset();
        });
}

function ObtenerPrecio(idprecio) {
    let datosale = new URLSearchParams;
    datosale.append("idsale", idprecio);
    fetch('/Mostrar_sale', {
        method: 'post',
        body: datosale,
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    }).then(res => res.json())
        .then(data => {
            if (data.status == 401) return console.log(data)
            data.forEach(pdtosale => {
                document.getElementById('id_sale').value = pdtosale.id_precio;
                document.getElementById('cargo').value = pdtosale.fk_cargo;
                document.getElementById('precioproducto').value = pdtosale.precio;
            });
        });
}

function ActualizarPrecio() {
    let idpdtosale = document.getElementById('id_pdto_sale').value;
    let idsale = document.getElementById('id_sale').value;
    let preciosale = document.getElementById('precioproducto').value;
    let cargosale = document.getElementById('cargo').value;
    let datosaleactu = new URLSearchParams;
    datosaleactu.append('idpdto', idpdtosale);
    datosaleactu.append('idsale', idsale);
    datosaleactu.append('preciosale', preciosale);
    datosaleactu.append('cargosale', cargosale),
        fetch('/Actualizar_precios', {
            method: 'post',
            body: datosaleactu,
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }).then(res => res.json())
            .then(data => {
                if (data.status == 401) return console.log(data)
                Listarprecios(idpdtosale);
                Swal.fire({
                    title: data.titulo,
                    icon: data.icono,
                    text: data.mensaje,
                    timer: data.timer
                });
            });
}
function formatHour(hour){
    let hours = hour.split(':')[0];
    let extension = '';
    if(parseInt(hours) > 12) {
        hours = hours - 12;
        extension = 'p.m'
    } else extension = 'a.m'
    let minutes = hour.split(':')[1];
    return `${hours}:${minutes} ${extension}`;
}
function renderTableProductos(datos) {
    let lista = [];
    datos.forEach(element => {
        
        let medida = 'N/A';
        if (element.medidas) medida = element.medidas;
        let array = {
            "id_pdto": element.Codigo_pdto,
            "Nombres": element.Nombre_pdto,
            "Imagen": "<img class='imgpdto' src='/img/products/" + element.Imgpdto + "'></img>",
            "Descripcion": element.Descripcion,
            "UP": element.Nombre_up,
            "Tipo": element.tipo,
            "Inventario": element.inventario,
            "Medida": medida,
            "Promocion":element.promocion,
            "Descuento": element.porcentaje + "%",
            "MaximoRes": element.MaxReserva,
            "Estado": element.Estado,
            "Horario": `${formatHour(element.hora_inicio)} <br> ${formatHour(element.hora_fin)}`,
            "btn": `<div class="btn-group">
                <a class="btn btn-edit" onclick="Buscarproductos(` + element.Codigo_pdto + `);">Editar</a>
                <a class="btn btn-sale" onclick="Buscarpstoprecio(` + element.Codigo_pdto + `);">Precio</a>
            </div>`,
        }
        lista.push(array)
    });
    $('#table-productos').DataTable({
        lengthChange: false,
        autoWidth: false,
        destroy: true,
        responsive: true,
        data: lista,
        columns: [
            { "data": "id_pdto" },
            { "data": "Nombres" },
            { "data": "Imagen" },
            { "data": "Descripcion" },
            { "data": "UP" },
            { "data": "Tipo" },
            { "data": "Inventario" },
            { "data": "Medida" },
            { "data": "Promocion" },
            { "data": "Descuento" },
            { "data": "MaximoRes" },
            { "data": "Estado" },
            { "data": "Horario" },
            { "data": "btn" }
        ]
    })
}