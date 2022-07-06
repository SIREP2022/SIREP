var detallesListados = [];
window.onload = listarMovimientos;
function crearFields(){
    document.getElementById("id_movimiento").value = '';
    document.getElementById("inputPIdCliente").value = '';
    document.getElementById("nombre").value = '';
    var divBTN = document.getElementById('botones-accion-movimiento');
    divBTN.innerHTML = ``;
    renderTableCart([]);
}

var facturar = new bootstrap.Modal(document.getElementById('modalFacturar'), { keyboard: false });
function compranueva() {
    facturar;
    facturar.toggle();
}

var newVenta = new bootstrap.Modal(document.getElementById('modalNewVenta'), { keyboard: false });

function nuevaVenta() {
    let btn = document.getElementById('sbutton');
    btn.setAttribute('style', 'display: block;');
    crearFields();
    newVenta.toggle();
}

function listarMovimientos() {
    fetch('/listarMovimientos', {
        method: 'get',
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    }).then(res => res.json()).then(data => {
        if(data.status == 401) return console.log(data)
        renderTableMovimientos(data);                
    });
}
function renderTableCart(info) {
    $("#tableCart").DataTable({
        destroy: true,
        autoWidth: false,
        searching: false,
        paging: false,
        bInfo: false,
        data: info,
        columns: [
            { data: "num" },
            { data: "persona" },
            { data: "nombre" },
            { data: "cantidad" },
            { data: "valor" },
            { data: "subtotal" },
            { data: "detalle" },
            { data: "accion" },
        ],
    });
}
function renderTableMovimientos(datos){
    let lista = [];
    datos.forEach(element => {
        if(element.detalles > 0 && element.Estado == 'Facturado') btnAccion = `<a class='detalle' href= "javascript:mostrarDetalle('${element.Id_movimiento}','${element.personas}','${element.identificacion}');"><i class='icon-bookmark-outline'></i>Facturar</a>`;
        else btnAccion = ''
        btnImprimir = "<a class='print' href='javascript:Facturar("+element.Id_movimiento+")'><i class='icon-file-pdf-o' style='display:none'></i></a>"
        if(element.Estado=='Facturado')btnImprimir = "<a class='print' href='javascript:Facturar("+element.Id_movimiento+")'><i class='icon-file-pdf-o' style='display:block'></i></a>"
        else btnImprimir = ''
        let array = {
            "IDCompra": element.Id_movimiento,
            "Identificacion" : element.identificacion,
            "Comprador": element.personas,
            "Fecha" : element.Fecha,
            "Valor": element.total,
            "Estado": element.Estado,
            "Imprimir": btnImprimir,
            "Accion": btnAccion,
        }
        lista.push(array)
    });
    $('#lista').DataTable({
        lengthChange: false,
        autoWidth: false,
        destroy: true,
        responsive: true,
        data: lista,
        columns: [
            {"data": "IDCompra"},
            {"data": "Identificacion"},
            {"data": "Comprador"},
            {"data": "Fecha"},
            {"data": "Valor"},
            {"data": "Estado"},
            {"data": "Imprimir"},
            {"data": "Accion"}
        ]
    })
}
/* ============================detalle de la venta=================================== */
var detalleModal = new bootstrap.Modal(document.getElementById('modalNewVenta'), { keyboard: false });

function listarDetalle (Id_movimiento, tipo){
    var datos = new URLSearchParams();
    datos.append("idcodigo", Id_movimiento);
    fetch('/listarDetalle/'+Id_movimiento, {
        method: 'get',
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    }).then(res => res.json())
    .then((data) => {
        this.detallesListados = data;
        let productosMovimiento = [];
        let i = 1;
        data.forEach((producto) => {
            console.log(producto)
            if (producto.id_detalle == null) return;
            let detalle = '';
            let accion = ' <div class="btn-group" style="width: 100%;">';
            
            if(producto.Entregado != 'Entregado') {
                detalle += "<span class='span-rojo'>Sin entregar</span>"
             } else {
                detalle += "<span class='span-verde'>Entregado</span>"
            } 
            if(tipo == 'facturado') {
                if(producto.EstadoVenta != 'Facturado') {
                    accion += `<button class="btn btn-primary" onclick="Factura('`+producto.id_detalle +`')" style="width:80px;>
                    <span class="">Facturar</span> </button>`
                } 
                accion += `<button onclick="modalEditar('`+producto.id_detalle +`', '${producto.EstadoVenta}')" class="btn btn-secondary icon-edit-pencil" style="width:50px; height:38px; font-size:17px"></button>`
            } else {
                accion = `<button id='delBtn' onclick="eliminarProductoMovimiento('` +
                producto.id_detalle +
                    `')">
                    <span class="icon-trash1"></span>
                </button>`
            }
            accion += '</div>';
            let arrayProducto = {
                num: i++,
                persona: producto.Nombres,
                nombre: producto.Nombre,
                cantidad: producto.Cantidad,
                valor: producto.VlrUnit,
                subtotal: producto.VlrTotal,
                detalle: detalle,
                accion: accion,
            };
            productosMovimiento.push(arrayProducto);
        });
        if(productosMovimiento.length <= 0) {document.getElementById('botones-accion-movimiento').innerHTML = '';}
        else {
            if(tipo == 'facturado') {
                var divBTN = document.getElementById('botones-accion-movimiento');
                divBTN.innerHTML = `
                <div class="row" id="botones-accion-movimiento">
                    <div class="col-md-6"><button class="btn btn-primary" style="width: 100%;" onclick="ImprimirFactura()">Finalizar</button></div>
                    <div class="col-md-6"><button class="btn btn-primary bg-danger" style="width: 100%;" onclick="AnularDetalles()">Anular</button></div>
                </div>`;
            } else {
                document.getElementById('botones-accion-movimiento').innerHTML = `
                <div class="col-12" id="regUserDiv">
                    <button onclick="Remplazofactura()" class="btn btn-primary">Facturar</button>
                </div>`
            }

        }
        renderTableCart(productosMovimiento)
        listarMovimientos();
    })
    
}
function mostrarDetalle(Id_movimiento,personas,identificacion) {
    document.getElementById('id_movimiento').value = Id_movimiento;
    document.getElementById('nombre').value = personas;
    document.getElementById('inputPIdCliente').value = identificacion;
    listarDetalle(Id_movimiento, 'facturado');

    let btn = document.getElementById('sbutton');
    btn.setAttribute('style', 'display: none;');

    let btnProductos = document.getElementById('boton_agregar_productos');
    if(btnProductos) btnProductos.setAttribute('style', 'display:none');
    detalleModal.show();
}
var modaleditar = new bootstrap.Modal(document.getElementById('modaleditar'), { keyboard:false});

function editarReserva(){
    modaleditar;
    modaleditar.toggle();
}
/* ===================modal editar============ */
function modalEditar(id_detalle, estado){
    var datos= new URLSearchParams();
    datos.append('Codigo_pdto',id_detalle);
    modaleditar.show();
    fetch('/botoneditar',{
        method: 'post',
        body:datos,
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    }
    ).then(res=>res.json())
    .then(data=>{
        if(data.status == 401) return console.log(data)
        document.getElementById('NombrePDT').value = data.nombre;
        document.getElementById('cantidad').value  = data.cantidad;
        document.getElementById('estado').value = data.estadetalle;
        document.getElementById('ID_detalle').value = data.id_detalle;

        let cantidad = document.getElementById('cantidad');
        if(estado == 'Facturado'){
            cantidad.setAttribute('disabled', 'disabled')
        } else {
            cantidad.removeAttribute('disabled')
        }
    });
   
}
/* ===============Editar================== */
function EditarDetalle(){
   var codigo_pdto = document.getElementById('ID_detalle').value;
   var cantidad= document.getElementById('cantidad').value;
   var estado = document.getElementById('estado').value;
   
   /* =====url datos==================================0 */
    var datos= new URLSearchParams();
    datos.append('codigo_pdto',codigo_pdto);
    datos.append('cantidad',cantidad);
    datos.append('estado',estado);
    
    fetch("/editar",{
        method:'post',
        body : datos,
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    }).then(res=>res.json())
    .then(data=>{
        if(data.status == 401) return console.log(data)
        let id_movimiento = document.getElementById('id_movimiento').value;
        listarDetalle(id_movimiento, 'facturado')
    })
    modaleditar.toggle();
    alertaGlobal();
}

function alertF(){
    swealerFinalizarCompra()
}
function alertaDelete(){
    swealerestadoDeleteAFacrurar();
}
/* =====================aler cambiar estado delete a facturar======================== */
function swealerestadoDeleteAFacrurar(){
    Swal.fire({
        title: 'Seguro quieres Facturar??',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: '<a  onclick="finalizarCompra();">Confirmar Factura</a>',
        denyButtonText: `Cancelar Factura`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Factura Confirmada',
                showConfirmButton: false,
                timer: 1000
            })
        } else if (result.isDenied) {
            Swal.fire({
                icon: 'info',
                title: 'Factura Celada',
                showConfirmButton: false,
                timer: 1000,
            })
        }
    })
}
/* =================alertas======== */
function alertaGlobal(){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showCancelButton: false,
        timer: 3000
    })
    Toast.fire({
        icon: 'success',
        title: 'Actualizado con exito',
        showConfirmButton: false,
        timer: 2500
      })
    
}


function EstadoAnulado(id_detalle) {
    var datos = new URLSearchParams();
    datos.append("id_detalle",id_detalle)
    fetch('/EstadoAnulado', {
        method: 'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    }).then(res => res.json())
    .then();
}

function AnularMovimiento(id_movimiento) {
    var datos = new URLSearchParams();
    datos.append("Id_movimiento",id_movimiento)
    fetch('/AnularMovimiento', {
        method: 'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    }).then(res => res.json())
    .then(()=>{
        detallesListados.forEach(element => {
            EstadoAnulado(element.id_detalle);
        });
        listarMovimientos();
        detalleModal.hide();
    });
}

function AnularDetalles(){
    modalPermisoAdmin.show()
  /*   Swal.fire({
        title: '¿Estas seguro que deseas anular este movimiento?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
    }).then((result) => {
        if (result.isConfirmed) {
            let movimiento = document.getElementById('id_movimiento').value;
            AnularMovimiento(movimiento);
            Swal.fire({
                icon: 'success',
                title: 'Movimiento anulado exitosamente',
                showConfirmButton: false,
                timer: 1000
            })
            newVenta.hide();
            detalleModal.hide();
        } 
    }) */
}
function ImprimirFactura(){
    let message = '<p>';
    let total = 0;
    detallesListados.forEach(element => {
        if(element.EstadoVenta == 'Facturado'){
            total = total + element.VlrTotal;
            message += `${element.Nombre} : $ ${currency(element.VlrTotal)}<br>`
        }
    })
    message += '===============<br>'
    message += `Total : $ ${currency(total)}<br>`
    message += '</p>'
    Swal.fire({
        title: 'FACTURA',
        html: message,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Imprimir',
        denyButtonText: `Cancelar`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            let Id_movimiento = document.getElementById('id_movimiento').value;
            Facturar(Id_movimiento)
            Swal.fire({
                icon: 'success',
                title: 'Compra finalizada',
                showConfirmButton: false,
                timer: 1000
            })
            newVenta.hide();
            detalleModal.hide();
        } 
    })
}

var modalPermisoAdmin = new bootstrap.Modal(document.getElementById('modalPermisoAdmin'), {keyboard: false});
function validarAdmin(){
    let login = document.getElementById('login_admin').value;
    let password = document.getElementById('password_admin').value;

    var datos = new URLSearchParams();
    datos.append("login", login)
    datos.append("password", password);

    fetch('/validarAdmin', {
        method: 'post',
        body: datos,
        headers: {'Authorization': 'Bearer '+ token,}
    }).then(res => res.json())
    .then((data)=> {
        console.log(data)
        if(data.status == 401) return console.log(data)
        if(data.status == 200) {
            let movimiento = document.getElementById('id_movimiento').value;
            AnularMovimiento(movimiento);
            Swal.fire({
                icon: 'success',
                title: 'Movimiento anulado exitosamente',
                showConfirmButton: false,
                timer: 1000
            })
            newVenta.hide();
            detalleModal.hide();
            modalPermisoAdmin.hide();
            return;
        }
        if(data.status == 'error_auth') {
            return Swal.fire({
                icon: 'error',
                title: 'Usuario admin no autorizado',
                showConfirmButton: false,
                timer: 1000
            })
        }
    });
}
