var detallesListados = [];
/* ======VARIABLE DE MANEJO DEL MOVIMIENTO======= */
var movimientoVenta = {
    id: null,
    estado: null
}
let comprador = document.getElementById('inputPIdCliente')

$(document).ready(function () {
    $("#modalNewVenta").on("hidden.bs.modal", function () {
        document.getElementById("inputPIdCliente").value = "";
        document.getElementById("nombre").value = "";
        document.getElementById("cargo-usuario").value = "";
        document.getElementById("id_movimiento").value = "";
    });
});

var facturar = new bootstrap.Modal(document.getElementById("modalFacturar"), { keyboard: false, });
function compranueva() { facturar.toggle(); }
var newVenta = new bootstrap.Modal(document.getElementById("modalNewVenta"), { keyboard: false, });
function nuevaVenta() { newVenta.toggle(); }
var detalle = new bootstrap.Modal(document.getElementById("modalDetalle"), { keyboard: false, });
var addProdList = new bootstrap.Modal(document.getElementById("modalAddProd"), { keyboard: false, });

function addProdVen() {
    //Tabla del modal donde agregaremos los productos a la venta
    cargo_usuario = document.getElementById('cargo-usuario').value;
    let datos = new URLSearchParams();
    datos.append("cargo", cargo_usuario);
    fetch("/listarProductosPv", {
        method: "POST",
        body: datos,
        headers: {'Authorization': 'Bearer ' + token}
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status == 401) return console.log(data);
            let json = [];
            data.forEach(producto => {
                let array = {
                    "codigoPdto": producto.id_inventario,
                    "nombrePdto": producto.Producto,
                    "precioProd": '$' + producto.precio,
                    "stockProd": producto.stock,
                    "btn": `<a class='agregarButton' 
                    href='javascript:agregar(${producto.id_inventario});'>Agregar</a>`
                }
                json.push(array);
            });
            $('#tableAddProd').DataTable({
                "paging":true,
                "processing":true,
                "autoWidth": false,
                "responsive":true,
                "destroy":true,
                "data":json,
                dom: 'Bfrtip',
                columns:[
                    {"data": "codigoPdto"},
                    {"data": "nombrePdto"},
                    {"data": "precioProd"},
                    {"data": "stockProd"},
                    {"data": "btn"}
                ]
            })
        });

    addProdList;
    addProdList.toggle();
}
/* =============================Agregar producto========================================================= */
var productoAgregado = new bootstrap.Modal(
    document.getElementById("modalProductoAgregado"), { keyboard: false }
);



function agregar(cod_producto) {
    var datos = new URLSearchParams();
    let cargo_usuario = parseInt(document.getElementById("cargo-usuario").value);
    datos.append("codigop", cod_producto);
    datos.append("cargo", cargo_usuario);
    let tabla = document.getElementById("precio_prod");
    tabla.innerHTML = "";
    fetch("/consAddProd", {
        method: "post",
        body: datos,
        headers: {'Authorization': 'Bearer ' + token}
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status == 401) return console.log(data)
            // AQUI
            document.getElementById('id_inventario').value = data[0].id_inventario;
            let precio = data[0].precio;

            /*======Elementos del modulo==== */
            let labelPregunta = document.createElement('label');
            let labelNombre = document.createElement("label");
            let labelprecio = document.createElement("label");
            let lbDescuento = document.createElement("label");
            let lbTotal = document.createElement("label");
            let divsub1 = document.createElement("div");
            let divsub2 = document.createElement("div");
            let divsub3 = document.createElement("div");
            let divsub4 = document.createElement("div");
            let subdivsub4 = document.createElement("div");
            let inputCant = document.createElement("input");

            let selectEntregado = document.createElement('select');
            let op1 = document.createElement('option');
            let op2 = document.createElement('option');
            let op3 = document.createElement('option');
            let op1txt = document.createTextNode('Selecciona...');
            let op2txt = document.createTextNode('No entregado');
            let op3txt = document.createTextNode('Entregado');
            let imgProd = document.createElement('img');
            let preguntaEntrega = document.createTextNode('¿En la venta se va a entregar el producto?');

            /* =====Atributos de los elementos=====*/
            divsub1.setAttribute("class", "divsub1");
            divsub2.setAttribute("class", "divsub2");
            divsub3.setAttribute("class", "divsub3");
            divsub4.setAttribute("class", "divsub4");
            subdivsub4.setAttribute('class', 'sub-div4');
            inputCant.setAttribute("class", "inputCant");
            inputCant.setAttribute("id", "inputCant");
            inputCant.setAttribute("placeholder", "Cantidad...");
            inputCant.setAttribute("min", "0");
            inputCant.setAttribute("max", "10");
            inputCant.setAttribute("type", "number");
            labelNombre.setAttribute("class", "lbNombre");
            labelNombre.setAttribute("for", "inputCant");
            labelprecio.setAttribute("class", "lbPrecio");
            lbDescuento.setAttribute("class", "lb-descuento")
            lbTotal.setAttribute("id", "lb-total");

            labelPregunta.setAttribute('class', 'lb-pregunta');
            selectEntregado.setAttribute('id', 'select-entregado');
            selectEntregado.setAttribute('class', 'form-select');
            selectEntregado.setAttribute('onchange', 'ocultarButtonConfirmar()');
            op1.setAttribute('selected', 'selected');
            op1.setAttribute('value', '');
            op2.setAttribute('value', 'No Entregado');
            op3.setAttribute('value', 'Entregado');
            imgProd.setAttribute('class', 'img-prod');
            imgProd.setAttribute('src', 'img/products/' + data[0].imagen);

            /* =====texto nodos======== */
            let medidaProducto = '';
            if(data[0].medida) medidaProducto = ' X '+data[0].medida;
            let texto = document.createTextNode(data[0].Producto + medidaProducto);
            let texto2 = document.createTextNode("Unidad: $" + precio);
            let totaltxt = document.createTextNode("Total: $ 0");
            let porcentaje = data[0].porcentaje;
            let descuentotxt = document.createTextNode("Descuento: "+porcentaje+"%");


            /*=====Hijos de los nodos=====*/
            tabla.appendChild(divsub1);
            tabla.appendChild(divsub2);
            tabla.appendChild(divsub3);
            tabla.appendChild(divsub4);
            divsub1.appendChild(labelNombre);
            divsub2.appendChild(inputCant);
            divsub2.appendChild(labelprecio);
            divsub3.appendChild(imgProd);
            divsub4.appendChild(subdivsub4);
            subdivsub4.appendChild(lbDescuento);
            subdivsub4.appendChild(lbTotal);

            divsub4.appendChild(selectEntregado);
            divsub4.appendChild(labelPregunta);
            labelPregunta.appendChild(preguntaEntrega);
            selectEntregado.appendChild(op1);
            selectEntregado.appendChild(op2);
            selectEntregado.appendChild(op3);
            op1.appendChild(op1txt);
            op2.appendChild(op2txt);
            op3.appendChild(op3txt);

            lbDescuento.appendChild(descuentotxt);
            lbTotal.appendChild(totaltxt);
            labelNombre.appendChild(texto);
            labelprecio.appendChild(texto2);
            

            /*Auto multiplicacion de la cantidad de producto*/
            inputCant.addEventListener("change", sumar);
            inputCant.addEventListener("keyup", sumar);
            function sumar() {
                let cantVlr = precio;
                let cantProd = document.getElementById("inputCant").value;
                if (!cantProd) cantProd = 0;
                var descuento = (parseFloat(cantVlr) * (data[0].porcentaje/100)) * parseFloat(cantProd);
                var total = (parseFloat(cantVlr) * parseFloat(cantProd)) - descuento;
                document.getElementById("lb-total").innerHTML = "Total: $ " + total;
                return total;
            }
        });
    productoAgregado.toggle();
}
/*========== Oculta el boton de confirmar agregar cantidad del producto ============= */

function ocultarButtonConfirmar() {
    let inputsel = document.getElementById('select-entregado').value;

    if (inputsel == '') {
        document.getElementById('footer-compra').innerHTML = '';
    } else {
        document.getElementById('footer-compra').innerHTML = '<input type="button" id="conf-btn" class="btn btn-primary btnadd" onclick="AregarProductoCliente()" value="Confirmar" />';

    }
}
/* ===================buscar clientes================== */
document
    .getElementById("inputPIdCliente")
    .addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            buscarUser();
        }
    });
function buscarUser() {
    var iden = document.getElementById("inputPIdCliente").value;
    var datos = new URLSearchParams();
    datos.append("iden", iden);
    fetch("/filtro", {
        method: "post",
        body: datos,
        headers: {'Authorization': 'Bearer ' + token}
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status == 401) return console.log(data)
        // AQUÍ LANZA EL MODAL PARA CREAR USUARIO============================
        if (data.length <= 0) {
            document.getElementById("nombre").value = "Usuario no registrado.";
            document.getElementById("cargo").value = "Cargo.";
            registroCliente();
            let btnProductos = document.getElementById("boton_agregar_productos");
            btnProductos.disabled = true;
            btnProductos.setAttribute('id', 'btn-deshabilitado');
        }

        /* ====VARIABLES===== */
        var identificacion = data[0].identificacion;
        var nombre = data[0].Nombres;
        var cargo_usuario = data[0].Cargo;
        var nombre_cargo = data[0].nombre_cargo;
        if (identificacion != iden) {
            document.getElementById("nombre").value = "Usuario no registrado.";
            document.getElementById("nombre").value = "Cargo";
            document.getElementById("genVenDiv").innerHTML =
            '<input type="button" class="btn btn-primary btndone" onclick="" value="Registrar Usuario?">';
            $("#tableAddProd").DataTable({
                bInfo: false,
                destroy: true,
            });
        } else if (identificacion == iden) {
            document.getElementById("nombre").value = nombre;
            document.getElementById("cargo_nombre").value = nombre_cargo;
            document.getElementById("cargo-usuario").value = cargo_usuario;
            document.getElementById('divBtnAdd').innerHTML = '<input type="button" id="boton_agregar_productos" class="btn btn-primary btnadd" onclick="addProdVen();" value="Agregar Productos" />';
        }
        generarVenta(iden);
    })
    .catch((e) => console.log(e));
}
/* =========VENTA============ */
function eliminarProductoMovimiento(id) {
    var idenpPersona = document.getElementById('inputPIdCliente').value;
    var datos = new URLSearchParams();
    datos.append("idDetalle", id);
    fetch("/eliminarDetalle", {
        body: datos,
        method: "POST",
        headers: {'Authorization': 'Bearer ' + token,}
    }).then((res) => res.json())
    .then((res) => {
        if (res.status == 401) return console.log(res)
        if (res.status == 200) {
            generarVenta(idenpPersona);
        }
    });
}
/* ============================= */
function generarVenta(ident) {
    var datos = new URLSearchParams();
    datos.append("iden", ident);
    fetch("/genventa", {
        method: "post",
        body: datos,
        headers: {'Authorization': 'Bearer ' + token}
    }).then((res) => res.json())
    .then((data) => {
        if (data.status == 401) return res.json(data);
        document.getElementById('id_movimiento').value = data[0].Id_movimiento;
        listarDetalle(data[0].Id_movimiento);
        listarMovimientos();
    })
    .catch((e) => console.log(e));
}


$("#tableCart").DataTable({
    destroy: true,
    searching: false,
    paging: false,
    bInfo: false,
});
/* ==========================Cambiar de delete a Facturado==================0= */
/*===================== swealer alerta============================== */
function RealizarFactura() {
    let validar = this.detallesListados.find(element => element.EstadoVenta == 'Reservado');
    if(validar) return launchAlert({icon:'error', message: 'Valida los destalles pendientes antes de facturar'})
    Swal.fire({
        title: '¿Seguro que quieres Facturar?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Confirmar Factura',
        denyButtonText: `Cancelar Compra`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            MostrarImprimirBTN();
            Swal.fire({
                icon: 'success',
                title: 'Factura Confirmada',
                showConfirmButton: false,
                timer: 1000
            })
        } 
    })
}

function MostrarImprimirBTN() {
    var divBTN = document.getElementById('botones-accion-movimiento');
    divBTN.innerHTML = `
    <div class="row" id="botones-accion-movimiento">
        <div class="col-md-6"><button class="btn btn-primary" style="width: 100%;" onclick="ImprimirFactura()">Imprimir</button></div>
        <div class="col-md-6"><button class="btn btn-primary bg-danger" style="width: 100%;" onclick="AnularDetalles()">Anular</button></div>
    </div>`;

    var ident = document.getElementById('inputPIdCliente').value;
    var Id_movimiento = document.getElementById('id_movimiento').value;
    var datos = new URLSearchParams();
    datos.append("iden", ident);
    datos.append("Id_movimiento", Id_movimiento);
    fetch("/CambiarEstado", {
        method: "post",
        body: datos,
        headers: {'Authorization': 'Bearer ' + token,}
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status == 401) return res.json(data)
        fetch('/listarDetalle/' + Id_movimiento, {
            method: 'get',
            headers: {'Authorization': 'Bearer ' + token}
        }).then(res => res.json())
        .then((data) => {
            let productosMovimiento = [];
            if(data.length > 0){
                this.movimientoVenta.id = document.getElementById('id_movimiento').value;
                this.movimientoVenta.estado = data[0].EstadoMov;
            }
            let i = 1;
            data.forEach((producto) => {
                if (producto.id_detalle == null) return;
                let detalle = '';
                if (producto.Entregado != 'Entregado') {
                    detalle += "<span class='span-rojo'>Sin entregar</span>"
                } else {
                    detalle += "<span class='span-verde'>Entregado</span>"
                }
                if (!producto.Nombres) producto.Nombres = producto.Persona;
                let arrayProducto = {
                    num: i++,
                    persona: producto.Nombres,
                    nombre: producto.Nombre,
                    cantidad: producto.Cantidad,
                    valor: producto.VlrUnit,
                    subtotal: producto.VlrTotal,
                    detalle: detalle,
                    accion: `<button class="btn btn-secondary icon-edit-pencil"  
                    onclick="modalEditar('${producto.id_detalle}')" style="width:50px; height:38px; font-size:17px"></button>`
                };
                productosMovimiento.push(arrayProducto);
            });
            renderTableCart(productosMovimiento);
            listarMovimientos();
        });
        })
        .catch((e) => console.log(e));
}
function listarDetalle(Id_movimiento){
    var datos = new URLSearchParams();
    datos.append("idcodigo", Id_movimiento);
    fetch('/listarDetalle/'+Id_movimiento, {
        method: 'get',
        headers: {'Authorization': 'Bearer '+ token,}
    }).then(res => res.json())
    .then((data) => {
        let productosMovimiento = [];
        this.detallesListados = data;
        if(data.length > 0){
            this.movimientoVenta.id = document.getElementById('id_movimiento').value;
            this.movimientoVenta.estado = data[0].EstadoMov;
        }
        let i = 1;
        data.forEach((producto) => {
            if (producto.id_detalle == null) return;
            let detalle = '';
            let accion = ' <div class="btn-group" style="width: 100%;">';
            if(producto.Entregado != 'Entregado') {
                detalle += "<span class='span-rojo'>Sin entregar</span>"
            } else {
                detalle += "<span class='span-verde'>Entregado</span>"
            } 
            switch (producto.EstadoVenta) {
                case 'Reservado':
                    accion += `<button class="btn btn-secondary" onclick="Factura('${producto.id_detalle}')" style="width:80px;>
                    <span class="">Facturar</span> </button>
                    <button id='delBtn' class="btn btn-danger" onclick="eliminarProductoMovimiento('${producto.id_detalle}')">
                        <span class="icon-trash1"></span>
                    </button>`
                    break;
                case 'Facturado':
                    accion += `<button class="btn btn-secondary icon-edit-pencil"  
                    onclick="modalEditar('${producto.id_detalle}')" style="width:50px; height:38px; font-size:17px"></button>`;
                    break;

                default:
                    break;
            }
            if(this.movimientoVenta.estado == 'Facturado') {

            } else {
                if(producto.EstadoVenta == 'Facturado'){
                    accion += `<button class="btn btn-danger" 
                    onclick="ConfirmarAnularDetalle(${producto.id_detalle})">Anular</button>`
                }
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
            if(movimientoVenta.estado == 'Facturado') {
                var divBTN = document.getElementById('botones-accion-movimiento');
                divBTN.innerHTML = `
                <div class="row" id="botones-accion-movimiento">
                    <div class="col-md-6"><button class="btn btn-primary" style="width: 100%;" onclick="ImprimirFactura()">Imprimir</button></div>
                    <div class="col-md-6"><button class="btn btn-primary bg-danger" style="width: 100%;" onclick="AnularDetalles()">Anular</button></div>
                </div>`;
            } else {
                document.getElementById('botones-accion-movimiento').innerHTML = `
                <div class="col-12" id="regUserDiv">
                    <button onclick="RealizarFactura()" class="btn btn-primary">Facturar</button>
                </div>`
            }

        }
        renderTableCart(productosMovimiento)
        listarMovimientos();
    })  
}

/* ======================================facturado================================ */
function Factura(id_detalle) {
    let movimiento = document.getElementById('id_movimiento').value;
    var datos = new URLSearchParams();
    datos.append("id_detalle", id_detalle)
    fetch('/EstadoFacturado', {
        method: 'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    }).then(res => res.json())
        .then(() => listarDetalle(movimiento));
}
/* ===============finalizar la compra */
function finalizarCompra() {
    fetch("/endCompra", {
        method: 'post',
        headers: {'Authorization': 'Bearer ' + token}
    }).then(res => res.json())
        .then(data => {
            console.log(data)
        })
}
function AregarProductoCliente() {

    let cantidad = document.getElementById('inputCant').value;
    comprador = comprador.value;
    let movimiento = document.getElementById('id_movimiento').value;
    let inventario = document.getElementById('id_inventario').value;
    let cargoCod = document.getElementById('cargo-usuario').value;
    let estadoEntrega = document.getElementById('select-entregado').value;
    var datos = new URLSearchParams();
    datos.append('estadoEntega', estadoEntrega);
    datos.append('codCargo', cargoCod);
    datos.append("canProd", cantidad);
    datos.append("comprador", comprador);
    datos.append("movimiento", movimiento);
    datos.append("id_inventario", inventario);
    fetch('/agregarDetalle', {
        method: 'POST',
        body: datos,
        headers: { 'Authorization': 'Bearer ' + token, }
    }).then(res => res.json())
        .then(data => {
            if (data.status == 401) return console.log(data)
            if (data.status == 200) {
                generarVenta(comprador)
                productoAgregado.hide();
                addProdList.hide();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: data.message,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        }).catch(e => console.log(e))
}
var infoProductosPrecio = new bootstrap.Modal(document.getElementById("modalInfoProd"), { keyboard: false, });

document.getElementById('ver-precios').addEventListener('click', (e) => {
    fetch('/listarProductosVenta', {
        method: 'get',
        headers: {'Authorization': 'Bearer ' + token}
    }).then(res => res.json())
        .then(data => {
            if (data.status == 401) return console.log(data);
            let array = [];
            data.forEach(producto => {
                let precios = '<ul style="text-align: left;">';
                producto.precio.split('|').forEach(element => {
                    if(!element.replace(',', '')) return;
                    precios += `<li>${element.replace(',', '')}</li>`
                })
                precios += '</ul>';
                
                let json = {
                    codigo: producto.codigo,
                    Producto: producto.Producto,
                    stock: producto.stock,
                    estado: producto.estado,
                    precio: precios
                }
                
                array.push(json);
            });
            
            $("#tableInfoProducto").DataTable({
                destroy: true,
                autoWidth: false,
                data: array,
                dom: 'Bfrtip',
                columns: [
                    { data: "codigo" },
                    { data: "Producto" },
                    { data: "stock" },
                    { data: "estado" },
                    { data: "precio" },
                ],
            });
        }).catch((e) => console.log(e));
    infoProductosPrecio.toggle();
});
$('#inputPIdCliente').focus();
/* ===========ANULA EL DETALLE SELECCIONADO============ */
function ConfirmarAnularDetalle(id_detalle){
    Swal.fire({
        title: '¿Deseas anular este detalle?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
    }).then((result) => {
        if (result.isConfirmed) {
            EstadoAnulado(id_detalle)
            .then(() => {
                listarMovimientos();
                generarVenta(comprador.value)
            })
        }
    });
}
function EstadoAnulado(id_detalle) {
    var datos = new URLSearchParams();
    datos.append("id_detalle",id_detalle)
    return fetch('/EstadoAnulado', {
        method: 'post',
        body: datos,
        headers: {'Authorization': 'Bearer '+ token,}
    }).then(res => res.json())
}
/* ===========selector para el ID FICHA=============== */
document.getElementById('cargo').addEventListener('change', (e) => {
    var cargo = document.getElementById('cargo').value;
    if (cargo == 1) {
        div = document.getElementById('ID');
        div.style.display = 'block';
    }
    else {
        div = document.getElementById('ID');
        div.style.display = 'none';
    }
})