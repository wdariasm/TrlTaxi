app.service("reporteService",[ '$http', function ($http) {
    
    this.postCliente = function (objeto) { 
        var req = $http.post(uri+'/api/reporte/cliente',objeto); 
        return req; 
    };
    
    this.centroCosto = function (objeto) { 
        var req = $http.post(uri+'/api/reporte/centrocosto',objeto); 
        return req; 
    };
    
    this.getTipoServicio = function () {
        var req = $http.get(uri+'/api/tiposervicio');
        return req;
    };  
    
    this.getTipoVehiculo = function () {
        var req = $http.get(uri+'/api/tipoVehiculo');
        return req;
    };   
          
    this.validarIdentificacion = function(cedula){
        var req = $http.get(uri+'/api/conductor/' + cedula +'/validar');
        return req;	
    };
   
}]);


app.service("excelService",[ '$window', function ($window) {
    
     var uri='data:application/vnd.ms-excel;base64,',
            template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
            format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
    
    this.tableToExcel = function(tableId,worksheetName){
            var table=$(tableId),
                ctx={worksheet:worksheetName,table:table.html()},
                href=uri+base64(format(template,ctx));
            return href;
    };                     
}]);
