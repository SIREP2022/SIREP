let fechaActual = new Date();
let anioActual = fechaActual.getFullYear();
let mesActual = fechaActual.getMonth()+1;
if(mesActual < 10) mesActual = '0'+ mesActual;
let diaActual = fechaActual.getDate();
if(diaActual < 10) diaActual = '0'+ diaActual;

let finMes = anioActual + '-' + mesActual + '-' + diaActual;
let inicioMes = anioActual + '-' + mesActual + '-' + '01';

var fechainicio = document.getElementById("date-strat");
var fechafin = document.getElementById("date-end");
if(fechainicio) fechainicio.value = inicioMes;
if(fechafin) fechafin.value = finMes;


/* ROL ADMINISTRADOR */
function MostrarAdmin(){
    let fecha = new Date(fechainicio.value);
    let añoinicio = fecha.getFullYear();
    let mesinicio = fecha.getMonth()+1;
    let diainicio = fecha.getDate()+1;
    let cero = 0;
    let fechauno = añoinicio+"-"+cero+mesinicio+"-"+diainicio ;
    /* ========================================================== */
    let fechafinal = new Date (fechafin.value);
    let añofinal = fechafinal.getFullYear();
    let mesfinal = fechafinal.getMonth()+1;
    let diafinal = fechafinal.getDate()+1;
    let fechaend = añofinal+"-"+cero+mesfinal+"-"+diafinal;
    /* ========================================================== */
    let datosbusqueda = new URLSearchParams;
    datosbusqueda.append("fechastart",fechauno);
    datosbusqueda.append("fechaend",fechaend);
    fetch('/Reporte_rep_admin',
    {
        method:'post',
        body:datosbusqueda
    }).then(res=>res.json())
    .then(data=>{
        let json = [];
        let array = {}
        data.forEach(element => {
            array = {
                "col-1": element.up,
                "col-3": element.subtotal,
                "col-4": element.fecha_min,
                "col-5": element.fecha_max,
            }
            json.push(array);
        });
        $('#rep_admin').DataTable({
            "paging":true,
            "processing":true,
            "responsive":true,
            "destroy":true,
            "data":json,
            dom: 'Bfrtip',
            columns:[
                {"data": "col-1"},
                {"data": "col-3"},
                {"data": "col-4"},
                {"data": "col-5"}
            ]
        })
    });
};
/*  */
function MostrarAdminvalor(){
    let fecha = new Date(fechainicio.value);
    let añoinicio = fecha.getFullYear();
    let mesinicio = fecha.getMonth()+1;
    let diainicio = fecha.getDate()+1;
    let cero = 0;
    let fechauno = añoinicio+"-"+cero+mesinicio+"-"+diainicio ;
    /* ========================================================== */
    let fechafinal = new Date (fechafin.value);
    let añofinal = fechafinal.getFullYear();
    let mesfinal = fechafinal.getMonth()+1;
    let diafinal = fechafinal.getDate()+1;
    let fechaend = añofinal+"-"+cero+mesfinal+"-"+diafinal;
    /* ========================================================== */
    let datosbusqueda = new URLSearchParams;
    datosbusqueda.append("fechastart",fechauno);
    datosbusqueda.append("fechaend",fechaend);
    fetch('/Reporte_rep_val_admi',
    {
    method:'post',
    body:datosbusqueda
    }).then(res=>res.json())
    .then(data=>{
        let json = [];
        let array = {}
            data.forEach(element => {
                array = {
                    "col-1": element.producto,
                    "col-2": element.cantidad,
                    "col-3": element.valor,
                    "col-4": element.fecha_min,
                    "col-5": element.fecha_max,
                }
                json.push(array);
            });
        $('#rep_val_admi').DataTable({
            "paging":true,
            "processing":true,
            "responsive":true,
            "destroy":true,
            "data":json,
            dom: 'Bfrtip',
            columns:[
                {"data": "col-1"},
                {"data": "col-2"},
                {"data": "col-3"},
                {"data": "col-4"},
                {"data": "col-5"},
            ]
        })
    });
};
/*  */
function MostrarAdminreporDPV(){
    fetch('/Reporte_reporDPV',
    {
    method:'post'
    }).then(res=>res.json())
    .then(data=>{
        let json = [];
        let array = {}
            data.forEach(element => {
                array = {
                    "col-1": element.punto,
                    "col-2": element.producto,
                    "col-3": element.stock
                }
                json.push(array);
            });
        $('#reporDPV').DataTable({
            "paging":true,
            "processing":true,
            "responsive":true,
            "destroy":true,
            "data":json,
            dom: 'Bfrtip',
            buttons:[
            'copy','csv','excel','pdf','print'
            ],
            columns:[
                {"data": "col-1"},
                {"data": "col-2"},
                {"data": "col-3"}
            ]
        })
    });
};
/*  */
function MostrarAdminProduccion(){
    fetch('/Reporte_rep_produccion_admi',
    {
    method:'post'
    }).then(res=>res.json())
    .then(data=>{
        console.log(data)
        let json = [];
        let array = {}
            data.forEach(element => {
                array = {
                    "col-1": element.Nombre,
                    "col-2": element.pdto_nombre,
                    "col-3": element.stockcant
                }
                json.push(array);
            });
        $('#rep_produccion_admin').DataTable({
            "paging":true,
            "processing":true,
            "responsive":true,
            "destroy":true,
            "data":json,
            dom: 'Bfrtip',
            columns:[
                {"data": "col-1"},
                {"data": "col-2"},
                {"data": "col-3"}
            ]
        })
    });
}
/*  */
function Comparar_reporVent(){
    let fecha = new Date(fechainicio.value);
    let añoinicio = fecha.getFullYear();
    let mesinicio = fecha.getMonth()+1;
    let diainicio = fecha.getDate()+1;
    let cero = 0;
    let fechauno = añoinicio+"-"+cero+mesinicio+"-"+diainicio ;
    /* ========================================================== */
    let fechafinal = new Date (fechafin.value);
    let añofinal = fechafinal.getFullYear();
    let mesfinal = fechafinal.getMonth()+1;
    let diafinal = fechafinal.getDate()+1;
    let fechaend = añofinal+"-"+cero+mesfinal+"-"+diafinal;
    /* ========================================================== */
    let datosbusqueda = new URLSearchParams;
    datosbusqueda.append("fechastart",fechauno);
    datosbusqueda.append("fechaend",fechaend);
    fetch('/Reporte_reporVent',
    {
    method:'post',
    body:datosbusqueda
    }).then(res=>res.json())
    .then(data=>{
        let json = [];
        let array = {}
            data.forEach(element => {
                array = {
                    "col-1": element.punto,
                    "col-2": element.subtotal,
                }
                json.push(array);
            });
        $('#reporVent').DataTable({
            "paging":true,
            "processing":true,
            "responsive":true,
            "destroy":true,
            "data":json,
            dom: 'Bfrtip',
            buttons:[
                'copy','csv','excel','pdf','print'
                ],
            columns:[
                {"data": "col-1"},
                {"data": "col-2"},
            ]
        })
    });
}
/*  */
function Comparar_reporcanti(){
    let fecha = new Date(fechainicio.value);
    let añoinicio = fecha.getFullYear();
    let mesinicio = fecha.getMonth()+1;
    let diainicio = fecha.getDate()+1;
    let cero = 0;
    let fechauno = añoinicio+"-"+cero+mesinicio+"-"+diainicio ;
    /* ========================================================== */
    let fechafinal = new Date (fechafin.value);
    let añofinal = fechafinal.getFullYear();
    let mesfinal = fechafinal.getMonth()+1;
    let diafinal = fechafinal.getDate()+1;
    let fechaend = añofinal+"-"+cero+mesfinal+"-"+diafinal;
    /* ========================================================== */
    let datosbusqueda = new URLSearchParams;
    datosbusqueda.append("fechastart",fechauno);
    datosbusqueda.append("fechaend",fechaend);
    fetch('/Reporte_Reporcanti',
    {
    method:'post',
    body:datosbusqueda,
    headers: {
        'Authorization': 'Bearer '+ token,
    }
    }).then(res=>res.json())
    .then(data=>{
        let json = [];
        let array ={};
            data.forEach(element => {
                array = {
                    "col-1": element.punto,
                    "col-2": element.producto,
                    "col-3": element.cantidad,
                    "col-4": element.subtotal,
                    "col-5": element.fecha_min,
                    "col-6": element.fecha_max,
                }
                json.push(array);
            });
        $('#reporcanti').DataTable({
            "paging":true,
            "processing":true,
            "responsive":true,
            "destroy":true,
            "data":json,
            dom: 'Bfrtip',
            columns:[
                {"data": "col-1"},
                {"data": "col-2"},
                {"data": "col-3"},
                {"data": "col-4"},
                {"data": "col-5"},
                {"data": "col-6"},
            ]
        })
    });
}
/*======================= ROL UNIDADES PRODUCTIVAS=======================*/
function Comparar_report_up(){
    let fecha = new Date(fechainicio.value);
    let añoinicio = fecha.getFullYear();
    let mesinicio = fecha.getMonth()+1;
    let diainicio = fecha.getDate()+1;
    let cero = 0;
    let fechauno = añoinicio+"-"+cero+mesinicio+"-"+diainicio ;
    /* ========================================================== */
    let fechafinal = new Date (fechafin.value);
    let añofinal = fechafinal.getFullYear();
    let mesfinal = fechafinal.getMonth()+1;
    let diafinal = fechafinal.getDate()+1;
    let fechaend = añofinal+"-"+cero+mesfinal+"-"+diafinal;
    /* ========================================================== */
    let datosbusqueda = new URLSearchParams;
    datosbusqueda.append("fechastart",fechauno);
    datosbusqueda.append("fechaend",fechaend);
    fetch('/Reporte_reportUp',
    {
    method:'post',
    body:datosbusqueda
    }).then(res=>res.json())
    .then(data=>{
        let json = [];
        let array = {}
            data.forEach(element => {
                array = {
                    "col-1": element.pdto_nombre,
                    "col-2": element.cantidpdto
                }
                json.push(array);
            });
        $('#reportUp').DataTable({
            "paging":true,
            "processing":true,
            "responsive":true,
            "destroy":true,
            "data":json,
            dom: 'Bfrtip',
            columns:[
                {"data": "col-1"},
                {"data": "col-2"}
            ]
        })
    });
};
/*======================= ROL PUNTO VENTA=======================*/
/*  */
function Comparar_reporte_pvent (){
    let fecha = new Date(fechainicio.value);
    let añoinicio = fecha.getFullYear();
    let mesinicio = fecha.getMonth()+1;
    let diainicio = fecha.getDate()+1;
    let cero = 0;
    let fechauno = añoinicio+"-"+cero+mesinicio+"-"+diainicio ;
    /* ========================================================== */
    let fechafinal = new Date (fechafin.value);
    let añofinal = fechafinal.getFullYear();
    let mesfinal = fechafinal.getMonth()+1;
    let diafinal = fechafinal.getDate()+1;
    let fechaend = añofinal+"-"+cero+mesfinal+"-"+diafinal;
    /* ========================================================== */
    let datosbusqueda = new URLSearchParams;
    datosbusqueda.append("fechastart",fechauno);
    datosbusqueda.append("fechaend",fechaend);
    fetch('/Reporte_Reporte_Pvent',{
        method:'post',
        body:datosbusqueda
    }).then(res=>res.json())
    .then(data=>{
        let json = [];
        let array = {}
        data.forEach(element => {
            array = {
                "col-1": element.producto,
                "col-2": element.cantidad,
                "col-3": element.subtotal,
                "col-4": element.fecha_min,
                "col-5": element.fecha_max,
            }
            json.push(array);
        });
        $('#reporte_pvent').DataTable({
            "paging":true,
            "processing":true,
            "responsive":true,
            "destroy":true,
            "data":json,
            dom: 'Bfrtip',
            buttons:[
                'copy','csv','excel','pdf','print'
            ],
            columns:[
                {"data": "col-1"},
                {"data": "col-2"},
                {"data": "col-3"},
                {"data": "col-4"},
                {"data": "col-5"},
            ]
        })
    });
}
function Buscar_Reporte_UP(){
    let fecha = new Date(fechainicio.value);
    let añoinicio = fecha.getFullYear();
    let mesinicio = fecha.getMonth()+1;
    let diainicio = fecha.getDate()+1;
    let cero = 0;
    let fechauno = añoinicio+"-"+cero+mesinicio+"-"+diainicio ;
    /* ========================================================== */
    let fechafinal = new Date (fechafin.value);
    let añofinal = fechafinal.getFullYear();
    let mesfinal = fechafinal.getMonth()+1;
    let diafinal = fechafinal.getDate()+1;
    let fechaend = añofinal+"-"+cero+mesfinal+"-"+diafinal;
    /* ========================================================== */
    let datosbusqueda = new URLSearchParams;
    datosbusqueda.append("fechastart",fechauno);
    datosbusqueda.append("fechaend",fechaend);
    fetch('/productos-facturados-up',{
        method:'post',
        body:datosbusqueda
    }).then(res=>res.json())
    .then(data=>{
        let json = [];
        let array = {}
        data.forEach(element => {
            array = {
                "col-1": element.producto,
                "col-2": element.cantidad,
                "col-3": element.subtotal,
                "col-4": element.fecha_min,
                "col-5": element.fecha_max,
            }
            json.push(array);
        });
        $('#reporte_pvent').DataTable({
            "paging":true,
            "processing":true,
            "responsive":true,
            "destroy":true,
            "data":json,
            dom: 'Bfrtip',
            buttons:[
                'copy','csv','excel','pdf','print'
            ],
            columns:[
                {"data": "col-1"},
                {"data": "col-2"},
                {"data": "col-3"},
                {"data": "col-4"},
                {"data": "col-5"},
            ]
        })
    });
    
}
/*  */
