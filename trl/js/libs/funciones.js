app.service("funcionService", function () {
    this.DigitoVerificacion = function(nit) {
        var liPeso = [];
        liPeso[0] = 71;
        liPeso[1] = 67;
        liPeso[2] = 59;
        liPeso[3] = 53;
        liPeso[4] = 47;
        liPeso[5] = 43;
        liPeso[6] = 41;
        liPeso[7] = 37;
        liPeso[8] = 29;
        liPeso[9] = 23;
        liPeso[10] = 19;
        liPeso[11] = 17;
        liPeso[12] = 13;
        liPeso[13] = 7;
        liPeso[14] = 3;

        var liDif = 15 - nit.length;
        var liSuma = 0;
        for (var i = 0; i < nit.length; i++) {
            liSuma += nit.substring(i, i + 1) * liPeso[liDif + i];
        }
        var digitoChequeo = liSuma % 11;
        if (digitoChequeo >= 2) {
            digitoChequeo = 11 - digitoChequeo;
        }
        return digitoChequeo;
    };

    this.arrayObjectIndexOf = function (myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }
        return -1;
    };
    
    
    this.GetModuloUser = function (permisos){
        var Modulos = ['CONFIGURACION','CONTRATOS','PERSONAL','REPORTES','VEHICULOS','SERVICIOS' ];
        var module = "";
        for (var i = 0, max = Modulos.length; i < max; i++) {
            module += this.arrayObjectIndexOf(permisos, Modulos[i], 'pmModulo') != -1 ? "1" : "0";
        }
        return module;
    };
    
    this.FormaPago = function (){
        var forma = ["CREDITO" , "DEBITO", "EFECTIVO", "CHEQUE"];
        return forma;
    };  
        
    
    this.FormatFecha= function(f,horas) {
        var fecha = new Date(f);               
        var addTime = horas*3600;
        fecha.setSeconds(addTime);    
        return fecha;
    };
    
    this.PermisoCliente = function (){
        var permisos = [ { IdPermiso : 3 },  { IdPermiso : 7 },{ IdPermiso : 8 }];
        return permisos;
    };
    
    this.diferenciaDias = function (f1, f2){       
        var aFecha1 = f1.split('/'); 
        var aFecha2 = f2.split('/'); 
        var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]); 
        var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]); 
        var dif = fFecha2 - fFecha1;
        var dias = Math.floor(dif / (1000 * 60 * 60 * 24)); 
        return dias;
    };
    
});

app.service("serverData", function () {
    return {
        data: {}
    };
});