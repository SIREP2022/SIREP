const input = document.getElementById('buscar');

//GUARDA GLOBAL
var lista_Productos = [];
var producto_Select = [];
/* ========LISTA LOS DETALLES */
window.addEventListener('DOMContentLoaded', () => {
    var fecha = new Date();
    var mes = fecha.getMonth() + 1;
    var dia = fecha.getDate();
    var anio = fecha.getFullYear();
    if (dia < 10)
        dia = '0' + dia;
    if (mes < 10)
        mes = '0' + mes
    document.getElementById("date").innerHTML = dia + "/" + mes + "/" + anio;
    Listar_todos_Productos();
});

input.addEventListener('keyup', e => {
    const product = lista_Productos.filter(prod => {
        return prod.producto.toLowerCase().includes(input.value.toLowerCase());
    });
    document.getElementById('list_prod').innerHTML = '';
    if (product.length > 0) {
        Render_Productos(product);
    } else {
        Render_Productos(lista_Productos);
    }

});

function Listar_todos_Productos() {
    fetch('/ListarTodosProductos', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        if (data.status == 401) return data;
        // GUARDA LA INFOR EN LA VARIABLE
        this.lista_Productos = data;
        Render_Productos(data);
    });
}

function Render_Productos(data) {
    let fecha = new Date();
    let hour = fecha.getHours();
    if (hour < 10) hour = '0' + hour;
    let minutes = fecha.getMinutes();
    if (minutes < 10) minutes = '0' + minutes
    let seconds = fecha.getSeconds();
    if (seconds < 10) seconds = '0' + seconds;
    let timeHour = hour + ':' + minutes + ':' + seconds;
    let card_product = "";
    data.forEach(lista => {
        let medidaP = '';
        var descuento = (parseFloat(lista.precio) * (lista.porcentaje/100));
        let reservados = 0;
        if(lista.reservados) reservados = lista.reservados;
        if (lista.medidas) medidaP = ' - ' + lista.medidas;
        // INFO CARDS
        let precio_info = '';
        let descuento_info = '';
        let stock_info = ''
        let up_info = ''
        if (lista.tipo == 'Venta') {
            if(lista.promocion == 'No'){
                precio_info = `<p class='card-text'><label class='info_pdto'>Precio: </label>$ ${lista.precio} </p>`;
            }
            else if(lista.promocion == 'Si'){
                precio_info = `<p class='card-text'><label class='info_pdto'>Precio:</label><span class='info-descuento'>$ ${lista.precio}</span> - $ ${(lista.precio)-descuento}</p>`;
                descuento_info = `<p class='card-text'><label class='info_pdto'>Descuento: <span class='info_pdto_d'>${lista.porcentaje}%</span></label> </p>`;
            }
            stock_info = `<p class="card-text" id="precio"><label class="info_pdto">Stock: </label>${lista.stock} unidades / ${reservados} reservados </p>`
            up_info = `<p class="card-text"><label class="info_pdto">UP: </label> ${lista.up}</p>`;
            if(lista.control_inventario == 'No'){
                stock_info = `<p class="card-text" id="precio"><label class="info_pdto">Reservados:</label> ${reservados}</p>`;
            }
        }
        if(lista.tipo == 'Servicio') {
            stock_info = `<p class="card-text" id="precio"><label class="info_pdto">Stock: </label>${lista.stock} unidades</p>`;
        }
        card_product +=
            `<div class='card text-black bg-white mb-3 m-2'>
            <div class='card-header'>
                ${lista.producto}
            </div>
            <div class='card-body'>
                <div style='height: 120px; display:flex; justify-content: center; align-content: center'>
                    <img style="width: auto; height: 100%;" src='img/products/${lista.imagen} 'class='card-img-top'  width='80px' height='150px'>
                </div>
                <h5 class='card-title'>${lista.descripcion} ${medidaP} </h5>
                <div>
                <p class='card-text'><label class='info_pdto'>Tipo Producto: </label>Para ${lista.tipo} </p>
                ${precio_info}
                ${descuento_info}
                ${stock_info}
                ${up_info}
                <p class="card-text"><label class="info_pdto">Sitio: </label> ${lista.pv}</p>
            </div>
            </div> `;
        if (!lista.MaxReserva) lista.MaxReserva = lista.maxreserva;
        if (lista.reserva == 'Si' && (timeHour >= lista.hora_inicio)) {
            if (timeHour >= lista.hora_inicio && timeHour >= lista.hora_fin) {
                card_product += `<div class='card-footer'><span style="border: 10px;  color: rgb(224, 64, 64);">Tiempo de reserva superado</span></div>`;
            } else if(reservados >= lista.stock && lista.control_inventario == 'Si'){
                card_product += `<div class='card-footer'><span style="border: 10px;  color: rgb(224, 64, 64);">No hay reservas disponibles</span></div>`
            } 
            else {
                card_product += `<div class='card-footer'>
                <a class='btn btn-primary'
                href="javascript:Abrir_Frm_Reserva('${lista.producto}', '${lista.id_inventario}', '${lista.precio-descuento}','${lista.stock}', '${lista.MaxReserva}', '${lista.reservados}', '${lista.control_inventario}', '${lista.reserva_grupal}');">
                Reservar</a>
                </div>`;
            }
        }
        card_product += `</div>`;


    });

    document.getElementById('list_prod').innerHTML = card_product;

}


/* ================================= */
var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
    keyboard: false
});
/* ========FUNCION ABRIR============= */
function Abrir_Frm_Reserva(nombre, id, precio, stock, maxReserva, reservados, control_inventario, res_grupal) {
    if(!reservados || reservados == null) reservados = 0;
    document.getElementById('name').innerHTML = nombre;
    document.getElementById('cod_prod').value = id;
    document.getElementById('precio_pdto').value = precio;
    document.getElementById('maxReserva').value = maxReserva;
    document.getElementById('reservados').value = reservados;
    document.getElementById('control_inventario').value = control_inventario;
    document.getElementById('stockProd').value = stock;
    document.getElementById('total').innerHTML = '$ ' + precio;
    document.getElementById('subtotal').value = precio;
    document.getElementById('reserva_grupal').value = res_grupal;
    let ficha = document.getElementById('ficha').value;
    if(res_grupal == 'Si') document.getElementById('persona-reserva').setAttribute('style', 'display:block')
    else document.getElementById('persona-reserva').setAttribute('style', 'display:none')


    Listar_Reservas_Pendientes(); // se lista las reserva pendiente
    let tipo_reserva = document.getElementById('tipo_res').value;
    if (tipo_reserva == 'Grupal') {
        listarUsuaiosFicha(ficha); // se listan aprendices de la ficha
    } else {
        document.getElementById('persona-reserva').setAttribute('style', 'display:none')
    }

    myModal.show();
}

function Aumentar() {
    let maxReserva = document.getElementById('maxReserva').value;
    let Precio = document.getElementById('precio_pdto').value;
    let espacio = parseInt(document.getElementById('cantidad').innerHTML);
    let suma = espacio + 1;
    if (suma <= maxReserva) {
        document.getElementById('cantidad').innerHTML = suma;
        let unidad = (Precio * suma);
        let Subtotal = unidad;
        document.getElementById('total').innerHTML = "$ " + Subtotal;
        document.getElementById('subtotal').value = Subtotal;
    }
}

function Disminuir() {
    let Precio = document.getElementById('precio_pdto').value;
    let espacio = parseInt(document.getElementById('cantidad').innerHTML);
    let resta = espacio - 1;
    if (resta >= 1) {
        document.getElementById('cantidad').innerHTML = resta;
        let unidad = (Precio * resta);
        let Subtotal = unidad;
        document.getElementById('total').innerHTML = "$ " + Subtotal;
        document.getElementById('subtotal').value = Subtotal;
    }
}
/* ===================registro reserva=============== */
function RegistrarDetalle() {
    /* ======================= */
    let cantidad = document.getElementById('cantidad').innerHTML;
    let id_producto = document.getElementById('cod_prod').value;
    let id_movimiento = document.getElementById('id_movimiento_header').value;
    let tipo_res = document.getElementById('tipo_res').value;
    let subtotal = document.getElementById('subtotal').value;
    let reservados = document.getElementById('reservados').value;
    let stock = document.getElementById('stockProd').value;
    let control_inventario = document.getElementById('control_inventario').value;
    if(reservados == 'null') reservados = 0;
    if((parseInt(reservados) + parseInt(cantidad)) > parseInt(stock) && control_inventario == 'Si') {
        return Swal.fire({
            title: 'No hay reservas',
            icon: 'error',
            text: 'No hay stock disponible, fueron reservados.',
            timer: 1500
        })
    }
    /* ======================= */
    var datos = new URLSearchParams();
    datos.append('cantidad', cantidad);
    datos.append('id_producto', id_producto);
    datos.append('id_movimiento', id_movimiento);
    datos.append('subtotal', subtotal);

    if (tipo_res == 'Grupal') {
        let persona = document.getElementById('persona-reserva').value;
        if(!persona) persona = document.getElementById('ident').value;
        datos.append('persona', persona);
    } else {
        let persona = document.getElementById('ident').value;
        datos.append('persona', persona);
    }
    
    fetch('/Registrar_Detalle', {
        method: 'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json())
        .then(data => {
            Swal.fire({
                title: data.titulo,
                icon: data.icon,
                text: data.text,
                timer: 1500
            })
            Listar_todos_Productos();
            Listar_Reservas_Pendientes();
        })
    let cantistock = document.getElementById('cantidad').innerHTML = 1;
    myModal.hide();
    Listar_Reservas_Pendientes();

}







//=============LISTAR APRENDICES POR ID FICHA========================//
function listarUsuaiosFicha(idFicha) {
    let listarPersonas = document.getElementById('persona-reserva')
    var datos = new URLSearchParams();
    datos.append('idFicha', idFicha);
    fetch('/Listar_Usuaios_Ficha', {
        method: 'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json())
        .then(data => {
            let row = '<option value="">Selecciona aprendiz</option>';
            data.forEach(e => {
                row += '<option value="' + e.identificacion + '">';
                row += +e.identificacion + ' | ' + e.Nombres;
                row += '</option>';
            });
            listarPersonas.innerHTML = row;
        })
}