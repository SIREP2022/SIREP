function Facturar(Id_movimiento){

    /* ============fecha formateada==================== */
    var fecha = new Date();
    var ano = fecha.getFullYear();
    var mes = fecha.getMonth()+1;
    var dia = fecha.getDate();
    if(mes < 10){
        mes="0"+mes
    }
    if(dia < 10 ){
        dia="0"+dia
    }
    var fechaFormat=dia+"/"+mes+"/"+ano;
    console.log(Id_movimiento)
    /* ===================================================== */
    fetch('/factura/'+Id_movimiento,{
            method:'get',
            headers: {'Authorization': 'Bearer '+ token}
        })
        .then(res=>res.json())
        .then(datos=>{
            if(datos){
                var ident = datos[0].identificacion;
                /* factura sencilla */
                const doc = new jsPDF();
                /* var logo = new Image();
                var logo2 = new Image(); */
                
                doc.rect(1,1, 208, 120); // empty square
                /* =====logos================= */
                /* logo.src = 'img/logos/logosena.png';
                    doc.addImage(logo, 'JPG', 8, 3, 20, 12);
                logo2.src = 'img/logos/centro_user.png';
                doc.addImage(logo2, 'JPG', 165, 3, 36, 12); */
                /* ===contenido==== */ 
                doc.setFontSize(14);
                doc.text(33,6,'Centro de Gestion y Desarrollo Sostenible Surcolombiano');
                doc.setFontSize(12);
                doc.text(80,12,'Sena Empresa');
                /* =====pasar a string====== */
                doc.setFontSize(12);
                doc.text(10,20,'Identificacion');
                doc.setFontSize(12);
                doc.text(40,20,ident+'');
                doc.setFontSize(12);
                doc.text(10,26,'Nombres');
                doc.setFontSize(12);
                doc.text(40,26, datos[0].Nombres);
                doc.setFontSize(12);
                doc.text(175,20,'Factura: ' + datos[0].num_factura);
                doc.setFontSize(12);
                doc.text(175,26,fechaFormat);
                doc.line(1,28,208, 28); // horizontal line
                doc.text(5,34,'ID    Producto               ValorUnitario         Cant              Asignado                     Estado                  Valor');
                doc.line(1,35,208, 35); // horizontal line
                /* posicionamiento */
                var x=5;
                var y=40;
                var total=0;
                doc.setFontSize(10);

                var i = 0;

                datos.forEach(element => {
                    if(element.EstadoVenta == 'Facturado'){
                        var x=5;
                        doc.text(x,y,""+element.Codigo_pdto);
                        var x=15;
                        doc.text(x,y,""+element.Nombre);
                        var x=52;
                        doc.text(x,y,""+element.VlrUnit);
                        var x=88;
                        doc.text(x,y,""+element.Cantidad);
                        var x=110;
                        doc.text(x,y,""+element.Nombres.substr(0,20)+'...');
                        var x=153;
                        doc.text(x,y,""+element.Entregado);
                        var x=186;
                        /* sumar dos valores */
                        doc.text(x,y,""+element.VlrTotal);
                        total=total+ parseInt(element.VlrTotal) ;
                        y=y+5;
                    }
                });
                /* formato numero */
                total = total.toLocaleString('es')
                doc.setFontSize(12);
                doc.text(162,134,'Total: ');
                doc.setFontSize(12);
                doc.text(175,134,'$ '+total);
                /* firma */
                doc.setFontSize(12);
                doc.text(10,130,'_______________________');
                doc.setFontSize(12);
                doc.text(26,137,'Autorizado');
                
                /* Nombre factura */
                doc.save("Factura.pdf");
            }else{
                alert("sapo")
            }
        });
} 