const input=document.getElementById('buscar');
//GUARDA GLOBAL
var lista_Productos = [];
var producto_Select = [];
/* ========LISTA LOS DETALLES */
window.addEventListener('DOMContentLoaded',()=>{
    var fecha = new Date();
    var mes = fecha.getMonth()+1; 
    var dia = fecha.getDate();
    var anio = fecha.getFullYear();
    if(dia<10)
        dia='0'+dia;
    if(mes<10)
        mes='0'+mes
        document.getElementById("date").innerHTML = dia + "/" + mes + "/" + anio;
    Listar_todos_Productos();
});

input.addEventListener('keyup',e=>{
    const product=lista_Productos.filter(prod=>{
        return prod.producto.toLowerCase().includes(input.value.toLowerCase());
    });
    document.getElementById('list_prod').innerHTML='';
    if(product.length>0){
        Render_Productos(product);
    }else{
        Render_Productos(lista_Productos);
    }
    
});

function Render_Productos(data){
    let fecha = new Date();
    let hour = fecha.getHours();
    if(hour<10) hour = '0'+hour;
    let minutes = fecha.getMinutes();
    if(minutes<10) minutes = '0'+minutes
    let seconds = fecha.getSeconds();
    if(seconds<10) seconds = '0'+seconds;
    let timeHour = hour + ':' + minutes + ':' + seconds;
    let card_product="";
    data.forEach(lista=>{
       card_product+= 
       `<div class='card text-black bg-white mb-3 m-2'>
            <div class='card-header'>
                ${lista.producto}
            </div>
                        <div class='card-body'>
                            <div style='height: 120px; display:flex; justify-content: center; align-content: center'>
                                <img style="width: auto; height: 100%;" src='img/products/${lista.imagen} 'class='card-img-top'  width='80px' height='150px'>
                            </div>
                            <h5 class='card-title'>${lista.descripcion}  </h5>`;
                    if(lista.tipo=='Venta'){    
                    card_product+=     ` <div>
                        <p class='card-text'><label class='info_pdto'>Tipo Producto: </label>Para ${lista.tipo} </p>
                        <p class='card-text'><label class='info_pdto'>Precio: </label>$ ${lista.precio} </p>
                        <p class="card-text" id="precio"><label class="info_pdto">Stock: </label>${lista.stock} unidades</p>
                        <p class="card-text"><label class="info_pdto">UP: </label> ${lista.up}</p>
                        <p class="card-text"><label class="info_pdto">Sitio de Venta : </label> ${lista.pv} </p>
                            </div>`;
                    }else{
                    card_product+=   ` <div>
                        <p class='card-text'><label class='info_pdto'>Tipo Producto: </label>Para ${lista.tipo} </p>
                        <p class="card-text" id="precio"><label class="info_pdto">Stock: </label>${lista.stock} unidades</p>
                        <p class="card-text"><label class="info_pdto">Sitio: </label> ${lista.up}</p>
                            </div>`;
                    }

                    card_product+= `</div> `;
                    if(!lista.MaxReserva) lista.MaxReserva = lista.maxreserva;
                    if(lista.reserva=='Si' && (timeHour >= lista.hora_inicio)){
                        if(timeHour >= lista.hora_inicio && timeHour >= lista.hora_fin){
                            card_product+= `<div class='card-footer'>
                                <span style="border: 10px;  color: rgb(224, 64, 64);">Tiempo de reserva superado</span> 
                            </div>`;
                        } else {
                            card_product+=   `<div class='card-footer'>
                            <a class='btn btn-primary'
                            href="javascript:Abrir_Frm_Reserva('${lista.producto}',
                            '${lista.id_inventario}', '${lista.precio}', '${lista.MaxReserva}');">
                            Reservar</a>
                            </div>`;
                        }
                    }
                

        card_product+=`</div>` ;   
                        

    });
    
    document.getElementById('list_prod').innerHTML=card_product;

}

function Listar_todos_Productos(){
    fetch('/ListarTodosProductos',{
        method:'get',
        headers: {'Authorization': 'Bearer '+token}
    })
    .then(res=>res.json())
    .then(data=>{
        //console.log(data)
        if(data.status == 401) return data;
        // GUARDA LA INFOR EN LA VARIABLE
        this.lista_Productos=data;
        Render_Productos(data);
    });
        


}

function eliminarDetalle(id){
    var datos = new URLSearchParams();
    datos.append('id_detalle',id);
    fetch('/Eliminar_Detalle',{
        method:'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+token
        }
    }).then(res => res.json())
    .then(data => {
        if(data.status == 401) return console.log(data);
        /* Swal.fire({
            title: data.titulo,
            icon: data.icon,
            text:data.text,
            timer: 1500
        }) */
        Listar_Reservas_Pendientes()
  
    })
}
/* ================================= */
var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
    keyboard: false});
/* ========FUNCION ABRIR============= */
function Abrir_Frm_Reserva(nombre,id, precio, maxReserva){
    document.getElementById('name').innerHTML=nombre;
    document.getElementById('cod_prod').value=id;
    document.getElementById('precio_pdto').value = precio;
    document.getElementById('maxReserva').value = maxReserva;
    document.getElementById('total').innerHTML= '$ '+ precio;

    let ficha=  document.getElementById('ficha').value;
    var datos = new URLSearchParams();// que hace este codigo ??
    datos.append('cod_prod',id);// que hace este codigo ??

    Listar_Reservas_Pendientes();// se lista las reserva pendiente
    let tipo_reserva= document.getElementById('tipo_res').value;
    if(tipo_reserva=='Grupal'){
        listarUsuaiosFicha(ficha); // se listan aprendices de la ficha
    } else {
        document.getElementById('persona-reserva').setAttribute('style', 'display:none')
    }

    myModal.show();
}

function Aumentar(){
    let maxReserva = document.getElementById('maxReserva').value;
    let Precio = document.getElementById('precio_pdto').value;
    let espacio = parseInt(document.getElementById('cantidad').innerHTML);
    let suma = espacio + 1;
    if(suma <= maxReserva){
        document.getElementById('cantidad').innerHTML = suma;
        let unidad = (Precio*suma);
        let Subtotal = unidad;
        document.getElementById('total').innerHTML = "$ " + Subtotal;
    }
}
function Disminuir(){
    let Precio = document.getElementById('precio_pdto').value;
    let espacio = parseInt(document.getElementById('cantidad').innerHTML);
    let resta = espacio - 1;
    if(resta >= 1){
        document.getElementById('cantidad').innerHTML = resta;
        let unidad = (Precio*resta);
        let Subtotal = unidad;
        document.getElementById('total').innerHTML ="$ " + Subtotal;
    }
}

function Buscar_Producto(name,id){
    var datos = new URLSearchParams();
    datos.append('Codigo',name);

    fetch('/Buscar_Producto',{
        method:'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
    .then(res=>res.json())
    .then(data=>{
        data.forEach(pdto => {            
        document.getElementById('name').value=pdto.Nombre;
    });
    Abrir_Frm_Reserva(name, id);
    });
}
/* ===================registro reserva=============== */
function RegistrarDetalle(){
    /* ======================= */
    let cantidad = document.getElementById('cantidad').innerHTML;
    let id_producto = document.getElementById('cod_prod').value;
    let id_movimiento = document.getElementById('id_movimiento_header').value;

    let tipo_res = document.getElementById('tipo_res').value;
    
    /* ======================= */
    var datos = new URLSearchParams();

    datos.append('cantidad', cantidad);
    datos.append('id_producto', id_producto);
    datos.append('id_movimiento', id_movimiento);
 
    if(tipo_res=='Grupal') {
       let persona = document.getElementById('persona-reserva').value;
       datos.append('persona', persona);
    }
    else {
        let persona = document.getElementById('ident').value;
        datos.append('persona', persona);
    }

    fetch('/Registrar_Detalle',{
        method:'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+token
        }
    }).then(res=>res.json())
    .then(data=>{
        Swal.fire({
            title: data.titulo,
            icon: data.icon,
            text:data.text,
            timer: 1500
        })
        Listar_Reservas_Pendientes();
    })
    let cantistock = document.getElementById('cantidad').innerHTML = 1;
    myModal.hide();
    Listar_Reservas_Pendientes();

} 







//=============LISTAR APRENDICES POR ID FICHA========================//
function listarUsuaiosFicha(idFicha){
    let listarPersonas = document.getElementById('persona-reserva')
    var datos = new URLSearchParams();
    datos.append('idFicha', idFicha);
    fetch('/Listar_Usuaios_Ficha',{
        method:'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+token
        }
    }).then(res => res.json())
    .then(data => {
        let row = '';
        data.forEach(e => {
            row += '<option value="'+e.identificacion+'">';
            row += +e.identificacion + ' | ' + e.Nombres;
            row += '</option>';
        }); 
        listarPersonas.innerHTML = row;   
    })
}
