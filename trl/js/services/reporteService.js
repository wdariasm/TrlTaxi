app.service("reporteService",[ '$http', function ($http) {
    
    this.postAdministrador = function (banco) { 
        var req = $http.post(uri+'/api/reporte/admin',banco); 
        return req; 
    };
                 
   
}]);





