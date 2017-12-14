app.service("plantillaService", ['$http', function ($http) {
    //activas por tipo de servicio   
    this.get = function (id) {
        var req = $http.get(uri+'/api/plantilla/' + id);
        return req;
    }; 
    
    //todas por tipo de servicio
    this.getPorTipo = function (id) {
        var req = $http.get(uri+'/api/tiposervicio/' + id + '/plantilla');
        return req;
    };
        
    this.post = function (plantilla) { 
        var req = $http.post(uri+'/api/plantilla',plantilla); 
        return req; 
    };       
          
    this.put = function (id,plantilla) {        
        var req = $http.put(uri+'/api/plantilla/' + id, plantilla);
        return req;        
    };
    
    this.delete = function (plantilla) {        
        var req = $http.post(uri+'/api/plantilla/borrar',plantilla); 
        return req;        
    }; 
    
    this.postArchivo = function (formData) {        
        var req = $http.post(uri+'/api/plantilla/cargue', formData,{transformRequest: angular.identity, 
            headers: {'Content-Type': undefined}});
        return req;        
    };
        
}]);


