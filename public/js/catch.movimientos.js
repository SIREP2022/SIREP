$(document).ready(function() {
    $("#modalNewVenta").on("hidden.bs.modal", function() {
        document.getElementById("inputPIdCliente").value = "";
        document.getElementById("nombre").value = "";
        document.getElementById("tusuario").value = "";
        document.getElementById("add-prod").innerHTML = "";
        document.getElementById("id_movimiento").value = "";
    });
});

var facturar = new bootstrap.Modal(document.getElementById("modalFacturar"), {keyboard: false,});
function compranueva() {facturar.toggle();}
var newVenta = new bootstrap.Modal(document.getElementById("modalNewVenta"), {keyboard: false,});
function nuevaVenta() {newVenta.toggle();}
var detalle = new bootstrap.Modal(document.getElementById("modalDetalle"), {keyboard: false,});
var addProdList = new bootstrap.Modal(document.getElementById("modalAddProd"), {keyboard: false,});

function addProdVen() {
    //Tabla del modal donde agregaremos los productos a la venta
    tusuario = document.getElementById('tusuario').value;
    let datos = new URLSearchParams();
    datos.append("idcodigo", tusuario);
    fetch("/listarProductosPv", {
        method: "get",
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    })
    .then((res) => res.json())
    .then((data) => {
        if(data.status == 401) return console.log(data);
        for (let i = 0; i < data.length; i++) {
            let TipoUsuario = parseInt(document.getElementById("tusuario").value);
            let tableAddprod = document.getElementById("add-prod");
            let tusuarioDOM;

            switch (TipoUsuario) {
                case 1:
                    tusuarioDOM = data[i].aprendiz;
                    break;
                case 2:
                    tusuarioDOM = data[i].instructor;
                    break;
                case 3:
                    tusuarioDOM = data[i].administrativo;
                    break;
                case 4:
                    tusuarioDOM = data[i].externo;
                    break;
                case 5:
                    tusuarioDOM = data[i].auxiliar;
                    break;
                default:
                    break;
            }

            let col1 = document.createElement("tr");
            let row1 = document.createElement("td");
            let row2 = document.createElement("td");
            let row3 = document.createElement("td");
            let row4 = document.createElement("td");
            let row5 = document.createElement("td");

            //Textos de los datos de la tabla
            let codigoPdto = document.createTextNode(data[i].id_inventario);
            let nombreProd = document.createTextNode(data[i].Producto);
            let precioProd = document.createTextNode("$ " + tusuarioDOM);
            let upProd = document.createTextNode(data[i].stock);
            row5.innerHTML =
                "<a class='agregarButton' href='javascript:agregar(" +
                data[i].id_inventario +
                ");'>Agregar</a>";

                
            //Atributos de los td
            row1.setAttribute("scope", "row");
            row1.setAttribute("class", "row1");
            row2.setAttribute("scope", "row");
            row3.setAttribute("scope", "row");
            row4.setAttribute("scope", "row");
            row5.setAttribute("id", "row5");
            /* agregar.setAttribute("type", 'button');
                    agregar.setAttribute("id", 'add-lk');
                    agregar.setAttribute("class", 'add-lk'); */

            //Padre de los elementos de la tabla
            tableAddprod.appendChild(col1);
            col1.appendChild(row1);
            col1.appendChild(row2);
            col1.appendChild(row3);
            col1.appendChild(row4);
            col1.appendChild(row5);
            row1.appendChild(codigoPdto);
            row2.appendChild(nombreProd);
            row3.appendChild(precioProd);
            row4.appendChild(upProd);
        }


        setTimeout(() => {
            $("#tableAddProd").DataTable({
                bInfo: false,
                destroy: true,
                language: {
                    decimal: ",",
                    thousands: ".",
                    lengthMenu: "Mostrar _MENU_ registros",
                    zeroRecords: "No se encontraron resultados",
                    infoFiltered: "(filtrado de un total de _MAX_ registros)",
                    sSearch: "Buscar:",
                    oPaginate: {
                        sFirst: "Primero",
                        sLast: "Último",
                        sNext: "Siguiente",
                        sPrevious: "Anterior",
                    },
                    sProcessing: "Cargando...",
                },
            });
        }, 100);
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
    datos.append("codigop", cod_producto);
        let tabla = document.getElementById("precio_prod");
        tabla.innerHTML = "";
        fetch("/consAddProd", {
            method: "post",
            body: datos,
            headers: {
                'Authorization': 'Bearer '+ token,
            }
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.status == 401) return console.log(data)
            for (let i = 0; i < data.length; i++) {
                document.getElementById('id_inventario').value = data[0].id_inventario;
                let TipoUsuario = parseInt(document.getElementById("tusuario").value);
                let tusuarioDOM;

                switch (TipoUsuario) {
                    case 1:
                        tusuarioDOM = data[i].aprendiz;
                        break;
                    case 2:
                        tusuarioDOM = data[i].instructor;
                        break;
                    case 3:
                        tusuarioDOM = data[i].administrativo;
                        break;
                    case 4:
                        tusuarioDOM = data[i].externo;
                        break;
                    case 5:
                        tusuarioDOM = data[i].auxiliar;
                        break;
                    default:
                        break;
                }
                /*======Elementos del modulo==== */
                let labelPregunta = document.createElement('label');
                let labelNombre = document.createElement("label");
                let labelprecio = document.createElement("label");
                let lbTotal = document.createElement("label");
                let divsub1 = document.createElement("div");
                let divsub2 = document.createElement("div");
                let divsub3 = document.createElement("div");
                let divsub4 = document.createElement("div");
                let inputCant = document.createElement("input");

let selectEntregado = document.createElement('select');
let op1 = document.createElement('option');
let op2 = document.createElement('option');
let op3 = document.createElement('option');
let op1txt = document.createTextNode('Selecciona...');
let op2txt = document.createTextNode('No entregado');
let op3txt = document.createTextNode('Entregado');
let imgProd= document.createElement('img');
let preguntaEntrega = document.createTextNode('¿En la venta se va a entregar el producto?');



                /* =====Atributos de los elementos=====*/
                divsub1.setAttribute("class", "divsub1");
                divsub2.setAttribute("class", "divsub2");
                divsub3.setAttribute("class", "divsub3");
                divsub4.setAttribute("class", "divsub4");
                inputCant.setAttribute("class", "inputCant");
                inputCant.setAttribute("id", "inputCant");
                inputCant.setAttribute("placeholder", "Cantidad...");
                inputCant.setAttribute("min", "0");
                inputCant.setAttribute("max", "10");
                inputCant.setAttribute("type", "number");
                labelNombre.setAttribute("class", "lbNombre");
                labelNombre.setAttribute("for", "inputCant");
                labelprecio.setAttribute("class", "lbPrecio");
                lbTotal.setAttribute("id", "lb-total");

labelPregunta.setAttribute('class', 'lb-pregunta');
selectEntregado.setAttribute('id', 'select-entregado');
selectEntregado.setAttribute('onchange', 'ocultarButtonConfirmar()');
op1.setAttribute('selected', 'selected');
op1.setAttribute('value', '');
op2.setAttribute('value', 'No Entregado');
op3.setAttribute('value', 'Entregado');
imgProd.setAttribute('class', 'img-prod');
imgProd.setAttribute('src', 'img/products/'+data[i].imagen);


                /* =====texto nodos======== */
                let texto = document.createTextNode(data[i].Producto);
                let texto2 = document.createTextNode("Unidad: $" + tusuarioDOM);
                let totaltxt = document.createTextNode("Total: "+"$ 0");
                /*=====Hijos de los nodos=====*/
                tabla.appendChild(divsub1);
                tabla.appendChild(divsub2);
                tabla.appendChild(divsub3);
                tabla.appendChild(divsub4);
                divsub1.appendChild(labelNombre);
                divsub2.appendChild(inputCant);
                divsub2.appendChild(labelprecio);
                divsub3.appendChild(imgProd);
                divsub4.appendChild(lbTotal);

divsub4.appendChild(selectEntregado);
divsub4.appendChild(labelPregunta);
labelPregunta.appendChild(preguntaEntrega);
selectEntregado.appendChild(op1);
selectEntregado.appendChild(op2);
selectEntregado.appendChild(op3);
op1.appendChild(op1txt);
op2.appendChild(op2txt);
op3.appendChild(op3txt);



                
                lbTotal.appendChild(totaltxt);
                labelNombre.appendChild(texto);
                labelprecio.appendChild(texto2);

                /*Auto multiplicacion de la cantidad de producto*/
                inputCant.addEventListener("change", sumar);
                inputCant.addEventListener("keyup", sumar);
                function sumar() {
                    let cantVlr = tusuarioDOM;
                    let cantProd = document.getElementById("inputCant").value;
if(!cantProd) cantProd=0;

                    var total = parseInt(cantVlr) * parseInt(cantProd);
                    document.getElementById("lb-total").innerHTML = "Total: $ " + total;
                    return total;
                }
            }
        });
    productoAgregado.toggle();
}
/*========== Oculta el boton de confirmar agregar cantidad del producto ============= */

function ocultarButtonConfirmar (){
    let inputsel = document.getElementById('select-entregado').value;
    
    if(inputsel == ''){
    document.getElementById('footer-compra').innerHTML='';
    }else{
    document.getElementById('footer-compra').innerHTML='<input type="button" id="conf-btn" class="btn btn-primary btnadd" onclick="AregarProductoCliente()" value="Confirmar" />';
    
    }
    }





/* ===================buscar clientes================== */
document
    .getElementById("inputPIdCliente")
    .addEventListener("keydown", function(e) {
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
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    })
    .then((res) => res.json())
    .then((data) => {
        if(data.status == 401) return console.log(data)
        // AQUÍ LANZA EL MODAL PARA CREAR USUARIO============================
        if (data.length <= 0) {
            document.getElementById("nombre").value = "Usuario no registrado.";
            registroCliente();
            let btnProductos = document.getElementById("boton_agregar_productos");
            btnProductos.disabled = true;
            btnProductos.setAttribute('id', 'btn-deshabilitado');
        }

        /* ====VARIABLES===== */
        var identificacion = data[0].identificacion;
        var nombre = data[0].Nombres;
        var tusuario = data[0].Cargo;
        if (identificacion != iden) {
            document.getElementById("nombre").value = "Usuario no registrado.";
            document.getElementById("genVenDiv").innerHTML =
                '<input type="button" class="btn btn-primary btndone" onclick="" value="Registrar Usuario?">';
            $("#tableAddProd").DataTable({
                bInfo: false,
                destroy: true,
            });
        } else if (identificacion == iden) {
            document.getElementById("nombre").value = nombre;
            document.getElementById("tusuario").value = tusuario;
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
            headers: {
                'Authorization': 'Bearer '+ token,
            }
        })
        .then((res) => res.json())
        .then((res) => {
            if(res.status == 401) return console.log(res)
            if (res.status == 200) {
                generarVenta(idenpPersona);
            }
        });
}

function generarVenta(ident) {
    var datos = new URLSearchParams();
    datos.append("iden", ident);

    fetch("/genventa",{
        method: "post",
        body: datos,
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    })
    .then((res) => res.json())
    .then((data) => {
        if(data.status == 401) return res.json(data)
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
function Remplazofactura(){
    Swal.fire({
        title: 'Seguro quieres Facturar??',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Confirmar Factura',
        denyButtonText: `Cancelar Compra`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            RemplazofacturaSwelart();
            Swal.fire({
                icon: 'success',
                title: '    Factura Confirmada',
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

function RemplazofacturaSwelart(){
    var divBTN = document.getElementById('botones-accion-movimiento');
    divBTN.innerHTML = `
    <div class="row" id="botones-accion-movimiento">
        <div class="col-md-6"><button class="btn btn-primary" style="width: 100%;" onclick="ImprimirFactura()">Finalizar</button></div>
        <div class="col-md-6"><button class="btn btn-primary bg-danger" style="width: 100%;" onclick="AnularDetalles()">Anular</button></div>
    </div>
    `;

    var ident = document.getElementById('inputPIdCliente').value;
    var Id_movimiento = document.getElementById('id_movimiento').value;
    var datos = new URLSearchParams();
    datos.append("iden", ident);
    datos.append("Id_movimiento",Id_movimiento);
        fetch("/CambiarEstado", {
            method: "post",
            body: datos,
            headers: {
                'Authorization': 'Bearer '+ token,
            }
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.status == 401) return res.json(data)
            fetch('/listarDetalle/'+Id_movimiento, {
                method: 'get',
                headers: {
                    'Authorization': 'Bearer '+ token,
                }
            }).then(res => res.json())
            .then((data) => {
                let productosMovimiento = [];
                let i = 1;
                data.forEach((producto) => {
                    if (producto.id_detalle == null) return;
                    let detalle = '';
                    if(producto.Entregado != 'Entregado') {
                        detalle += "<span class='span-rojo'>Sin entregar</span>"
                    } else {
                        detalle += "<span class='span-verde'>Entregado</span>"
                    } 
                    if(!producto.Nombres) producto.Nombres = producto.Persona;
                    let arrayProducto = {
                        num: i++,
                        persona: producto.Nombres,
                        nombre: producto.Nombre,
                        cantidad: producto.Cantidad,
                        valor: producto.VlrUnit,
                        subtotal: producto.VlrTotal,
                        detalle: detalle,
                        accion: `<button class="btn btn-primary" onclick="Factura('`+producto.id_detalle +`')" style="width:80px;>
                            <span class="">Facturar</span>
                        </button> <button onclick="modalEditar('`+producto.id_detalle +`')" class="btn btn-primary icon-edit-pencil" style="width:50px; font-size:17px"></button>`,
                    };
                    productosMovimiento.push(arrayProducto);
                });
                renderTableCart(productosMovimiento);
                listarMovimientos();
            });
        })
        .catch((e) => console.log(e));
}
/* ======================================facturado================================ */
function Factura(id_detalle){
    let movimiento = document.getElementById('id_movimiento').value;
    var datos = new URLSearchParams();
    datos.append("id_detalle",id_detalle)
    fetch('/EstadoFacturado', {
        method: 'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    }).then(res => res.json())
    .then(data => {
        listarDetalle(movimiento, 'facturado')
    }); 
}
/* ===============finalizar la compra */
function finalizarCompra(){
    fetch("/endCompra", {
        method:'post',
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    }).then(res=>res.json())
    .then(data=>{
       console.log(data)
    })    
}
function AregarProductoCliente() {
    
    let cantidad = document.getElementById('inputCant').value;
    let comprador = document.getElementById('inputPIdCliente').value;
    let movimiento = document.getElementById('id_movimiento').value;
    let inventario = document.getElementById('id_inventario').value;
    let cargoCod = document.getElementById('tusuario').value;
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
        headers: {'Authorization': 'Bearer '+ token,}
    }).then(res => res.json())
    .then(data => {
        if(data.status == 401) return console.log(data)
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
var infoProductosPrecio = new bootstrap.Modal(document.getElementById("modalInfoProd"), {keyboard: false,});
document.getElementById('ver-precios').addEventListener('click', (e) => {
    fetch('/listarPrecioProductos', {
        method: 'get',
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    }).then(res => res.json())
    .then(data => {
        if(data.status == 401) return console.log(data)
        let infoProductos = []
        let arrayProducto = {}
        data.forEach(element => {
            arrayProducto = {
                'codigo': element.codigo,
                'nombre': element.Producto,
                'stock': element.stock,
                'aprendiz': element.aprendiz,
                'instructor': element.instructor,
                'admin': element.administrativo,
                'externo': element.externo,
                'auxiliar': element.auxiliar,
                'estado': element.estado,
            };
            infoProductos.push(arrayProducto);

            $("#tableInfoProducto").DataTable({
                destroy: true,
                autoWidth: false,
                data: infoProductos,
                dom: 'Bfrtip',
                columns: [
                    { data: "codigo" },
                    { data: "nombre" },
                    { data: "stock" },
                    { data: "aprendiz" },
                    { data: "instructor" },
                    { data: "admin" },
                    { data: "externo" },
                    { data: "auxiliar" },
                    { data: "estado" },
                ],
            }); 
        });
    }).catch((e) => console.log(e));
    infoProductosPrecio.toggle();
});
$('#inputPIdCliente').focus();
/* ===========selector para el ID FICHA=============== */
document.getElementById('cargo').addEventListener('change', (e)=> {
    var cargo = document.getElementById('cargo').value;
    if( cargo == 1){
      div = document.getElementById('ID');
      div.style.display = 'block';
    }
    else{
      div = document.getElementById('ID');
      div.style.display = 'none';
    }
  })