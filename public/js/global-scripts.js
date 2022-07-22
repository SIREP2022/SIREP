let token = localStorage.getItem('token');
var url = location.pathname;

function formatDate(date){
    var fecha = new Date(date);
    var ano = fecha.getFullYear();
    var mes = fecha.getMonth()+1;
    var dia = fecha.getDate();
    if(mes < 10){
        mes="0"+mes
    }
    if(dia < 10 ){
        dia="0"+dia
    }
    return fechaFormat=dia+"/"+mes+"/"+ano;
}
function launchAlert(data){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showCancelButton: false,
        timer: 3000
    })
    Toast.fire({
        icon: data.icon,
        title: data.message,
        showConfirmButton: false,
        timer: 2500
    })
}
const currency = function(number){
    return new Intl.NumberFormat('em-IN').format(number);
};

let logoutBtn = document.getElementById('logout');
let reservaBtn = document.getElementById('menu_reserva');
let profileBtn = document.getElementById('profile');

function OpenAndCloseProfileBox(){
    let profileBox = document.getElementById('profile-box');
    if(profileBox.getAttribute('style')) profileBox.removeAttribute('style');
    else profileBox.setAttribute('style', 'display: block');
}
function OpenAndCloseReservaBox(){
    let reservaBox = document.getElementById('lista-reserva-box');
    if(reservaBox.getAttribute('style')) reservaBox.removeAttribute('style');
    else reservaBox.setAttribute('style', 'display: block');
}

function logOut(){
    let url = '/auth/logout';
    let config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: ''
    }
    fetch(url, config)
    .then(res => res.json())
    .then(data => {
        if(data.status == 'error') return window.location.href = '/'
    })
    .catch(err => console.log(err))
    window.location.href = '/';
}
function Crear_Movimiento(){
    fetch('/Crear_Movimiento',{
        method:'POST',
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
    .then(res=>res.json())
    .then(data => {
        if(document.getElementById('rol_user').value == 'Vocero') document.getElementById('tipo_res').value = 'Grupal'
        else document.getElementById('tipo_res').value = 'Individual'     

        document.getElementById('ficha').value=data[0].ficha;
        document.getElementById('id_movimiento_header').value=data[0].Id_movimiento;
        document.getElementById('ident').value=data[0].identificacion;
    })
}
function Listar_Reservas_Pendientes(){
    fetch('/Listar_Reservas_Pendientes',{
        method:'get',
        headers: {
            'Authorization': 'Bearer '+token
        }
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.status == 401) return data;
        let reservas = '';
        let body_reserva = document.getElementById('reserva-body');
        let total_reserva = document.getElementById('reserva-total');
        let count_reserva = document.getElementById('num-reserva');
        var total=0;
        let numReservas = 0;
        let id_detalle = '';
        if(data[0]) id_detalle = data[0].id_detalle;
        data.forEach(e => {
            if(e.id_detalle==null) return;
            var textcolor = '';
            var eliminarBTN = '';
            switch (e.Estado) {
                case 'Reservado': 
                    numReservas++;
                    total=total+e.subtotal;
                    eliminarBTN = `<a class="reserva-caja" href=javascript:eliminarDetalle(${e.id_detalle})><div class="eliminar-producto-res">Eliminar</div></a>`;
                    textcolor = 'text-success';
                break;
                case 'Rechazado': textcolor = 'text-danger';break;
                case 'Facturado': textcolor = 'text-orange';break;
            }
            
            reservas += 
            `<div class="reserva-section producto-reserva">
                <div class="imagen-reserva">
                    <img id src="img/products/${e.imagen} " class="card-img-top">
                </div>
                <div class="producto-res">
                    ${e.producto}  <span id="cant-prod">x ${e.cantidad}</span>
                </div>
                <div class="cliente-res">${e.Nombres.substr(0,20)}</div>
                <div class="valor-res">
                    $ ${currency(e.subtotal)}
                </div>
                <div class="fecha-res">
                    ${formatDate(e.Fecha)}
                </div>
                <div class="estado-res">
                    <span class="${textcolor}">${e.Estado}</span>
                </div>
                ${eliminarBTN}
            </div>`;
        });
        let cardFooter = '';

        if(data.length > 0 && id_detalle){
            if(total > 0) cardFooter += `
            <div class="row reserva-caja" style="border-bottom: 1px solid var(--light-gray-color);
            padding-bottom: 8px;">
                <div class="col-6"><b>Total</b></div>
                <div class="col-6" style="text-align: right; padding-right: 30px;">$ ${currency(total)}</div>
            </div>`
            cardFooter += `
            <div class="row reserva-caja" style="padding-top: 5px;">
                <a href="/historial-reservas" style="text-decoration: none;
                text-align: center;">Historial de reservas</a>
            </div>`
        } else cardFooter += `No existen reservas activas`;
        total_reserva.innerHTML = cardFooter;
        body_reserva.innerHTML = reservas;
        count_reserva.innerHTML = numReservas;

       
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
        Swal.fire({
            title: data.titulo,
            icon: data.icon,
            text:data.text,
            timer: 1500
        })
        if(url == '/admin') Listar_todos_Productos();
        Listar_Reservas_Pendientes()
  
    })
}
document.addEventListener('click', (e) => {
    /* =====CAJA DEL PERFIL==== */
    let profileBox = document.getElementById('profile-box');
    if(!profileBox.getAttribute('style')) return;
    if(e.target.parentNode.className != 'profile-box' 
    && e.target.parentNode.className != 'profile-section' ) {
        if(e.target.id == 'profile') return;
        else OpenAndCloseProfileBox();
    }
})
/* =====CAJA DE RESERVAS==== */
document.addEventListener('click', (e)=> {
    let reservaBox = document.getElementById('lista-reserva-box');
    if(!reservaBox.getAttribute('style')) return;

    if(e.target.parentNode.className != 'reserva-section' && 
    e.target.parentNode.className != 'lista-reserva-box' && 
    e.target.parentNode.className != 'reserva-section producto-reserva' && 
    e.target.parentNode.className != 'row reserva-caja' && 
    e.target.parentNode.className != 'imagen-reserva' && 
    e.target.parentNode.className != 'reserva-caja') {
        if(e.target.parentNode.className == 'reserva-lista') return;
        if(e.target.parentNode.id == 'menu_reserva') return;
        OpenAndCloseReservaBox();
    }
})
reservaBtn.addEventListener('click', ()=> { OpenAndCloseReservaBox()});
profileBtn.addEventListener('click', ()=> { OpenAndCloseProfileBox()});
logoutBtn.addEventListener('click', ()=> logOut());
window.addEventListener('DOMContentLoaded',()=>{
    Crear_Movimiento();
    Listar_Reservas_Pendientes();
});
