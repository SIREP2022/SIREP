let token = localStorage.getItem('token');
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
        data.forEach(e => {
            if(e.id_detalle==null) return;
            numReservas++;
            reservas += 
            `<div class="reserva-section producto-reserva">
                <div class="imagen-reserva">
                    <img id src="img/products/${e.imagen} " class="card-img-top">
                </div>
                <div class="producto-res">
                    ${e.Nombre}  <span id="cant-prod">x ${e.cantidad}</span>
                </div>
                <div class="cliente-res">${e.aprendiz.substr(0,20)}</div>
                <div class="valor-res">
                    $ ${currency(e.subtotal)}
                </div>
                <a class="reserva-caja" href=javascript:eliminarDetalle(${e.id_detalle})>
                    <div class="eliminar-producto-res">Eliminar</div>
                </a>
            </div>`;
            total=total+e.subtotal;
        });
        if(total > 0){
            total_reserva.innerHTML = 
            `<div class="row reserva-caja">
                <div class="col-6"><b>Total</b></div>
                <div class="col-6" style="text-align: right; padding-right: 30px;">$ ${currency(total)}</div>
            </div>`
        } else total_reserva.innerHTML = `No existen reservas activas`
        body_reserva.innerHTML = reservas;
        count_reserva.innerHTML = numReservas;

        if(document.getElementById('rol_user').value == 'Vocero') document.getElementById('tipo_res').value = 'Grupal'
        else document.getElementById('tipo_res').value = 'Individual'     

        document.getElementById('ficha').value=data[0].ficha;
        document.getElementById('id_movimiento_header').value=data[0].Id_movimiento;
        document.getElementById('ident').value=data[0].identificacion;
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
window.addEventListener('DOMContentLoaded',()=>{Listar_Reservas_Pendientes();});
