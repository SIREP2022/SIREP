window.onload = Listar_Produccion();
window.onload = function(){
    var fecha = new Date();
    var mes = fecha.getMonth()+1; 
    var dia = fecha.getDate();
    var anio = fecha.getFullYear();
    if(dia<10)
        dia='0'+dia;
    if(mes<10)
        mes='0'+mes
        document.getElementById("date").innerHTML = dia + "/" + mes + "/" + anio;
        document.getElementById("date2").innerHTML = dia + "/" + mes + "/" + anio;
}
//========== Modal de registro ==============
var myModal = new bootstrap.Modal(document.getElementById('myModal'), {keyboard: false});

function Abrir_Frm_Produccion(){myModal.show();}
//================================================

function mostrarproductos (idunida){
    let datos = new URLSearchParams;
    datos.append("codigoup",idunida);
    fetch('/llamarproductos',
    {   method:'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    }
    ).then(res=>res.json())
    .then(data=>{
        if(data.status == 401) return console.log(data)
        data.forEach(producto => {
            let name = value=producto.nameup;
            document.getElementById('nameup').innerHTML = name;
        });
        let html = '';
        for(let i =0; i<data.length; i++){
            html += '<option value="'+data[i].Codigo_pdto+'" class="visible">'+data[i].Namepdto+'</option>'
        }
        document.getElementById('pdto').innerHTML = html;
    });
} 

//===============Modal para actualizar ===============
var myModal2 = new bootstrap.Modal(document.getElementById('myModal2'), {keyboard: false});

function Abrir_Frm_Actualizar(idproduccion){
    myModal2.show();
    let datos = new URLSearchParams;
    datos.append('idproduccion',idproduccion)
    fetch('/Buscarproduccion',{
        method:'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.status == 401) return console.log(data)
        data.forEach(produccion => {
            let name = value=produccion.Nombre
            document.getElementById('codigo_produccion').value=produccion.id_produccion;
            document.getElementById('productseleccionado').innerHTML = name;
            document.getElementById('cantidadactu').value=produccion.Cantidad;
            document.getElementById('observacionactu').value=produccion.observacion;
        });
    });
}

//===============Listado de produccion ===============
function Listar_Produccion(){
    let valor = document.getElementById("unidadesPrd"). value;
    let datos = new URLSearchParams;
    datos.append('unidad',valor)
    fetch('/Listar_Produccion',{
        method:'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.status == 401) return console.log(data)
        var tabla='';
        for(var i=0; i<data.length;i++){
            tabla += '<tr ><td class="infocenter">'+data[i].Id_produccion+'</td>';
            tabla += '<td class="infocenter">'+data[i].Nombre+'</td>';
            tabla += '<td class="infocenter">'+data[i].fecha+'</td>';
            tabla += '<td class="infocenter">'+data[i].Cantidad+'</td>';
            tabla += '<td class="infocenter">'+data[i].Observacion+'</td>';
            tabla += '<td class="infocenter"><a class="icon-pencil" href=javascript:Abrir_Frm_Actualizar('+data[i].Id_produccion+')></a></td>';
            tabla += '</tr>';
        }
        $('#tablaProducccion').DataTable().destroy();
        document.getElementById('tabla').innerHTML=tabla;
        $('#tablaProducccion').DataTable({
            destroy: true,
            processing : true
        });
        mostrarproductos(valor);
    });
}

function RegistrarProduccion() {
    /* =================fecha local============= */

    let form = document.getElementById('form-produccion');
    var cant=document.getElementById('cantidad').value;
    var obser=document.getElementById('observacion').value;
    var fkpdto = document.getElementById('pdto').value;
    if(cant == 0){
        alert('Por favor ingrese una cantidad')
    }
    else{

    var datos= new URLSearchParams();
    
    datos.append('Cantidad',cant);
    datos.append('Observacion',obser);
    datos.append('fkp',fkpdto)

    fetch('/formR',{
        method:'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    }
    ).then(res=>res.json())
    .then(data=>{
        if(data.status == 401) return console.log(data)
        myModal.hide();
         Swal.fire({
            title: data.titulo,
            icon: data.icono,
            text: data.mensaje,
            showConfirmButton: false,
            timer: 1000
        })
        
    });
    form.reset();
    Listar_Produccion();
}
}
//===============Funcion para editar produccion===========
function EditarProduccion(){
    var idproduc = document.getElementById('codigo_produccion').value;
    var cant=document.getElementById('cantidadactu').value;
    var obser=document.getElementById('observacionactu').value;
    var datos= new URLSearchParams();
    datos.append('idproducc',idproduc)
    datos.append('Cantidad',cant)
    datos.append('Observacion',obser)
    fetch('/editarProduccion',{
        method:'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    }
    ).then(res=>res.json())
    .then(data=>{
        if(data.status == 401) return console.log(data)
        myModal.hide();
         Swal.fire({
                    title: data.titulo,
                    icon: data.icono,
                    text: data.mensaje,
                    showConfirmButton: false,
                    timer: 1800
        })
        myModal2.hide();
    });
    Listar_Produccion();
}

