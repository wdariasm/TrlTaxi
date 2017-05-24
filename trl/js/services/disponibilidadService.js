app.service("disponibilidadService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/disponibilidad/' + id);
        return req;
    };
               
    this.getAll = function (idPlantilla) {
        var req = $http.get(uri+'/api/plantilla/' + idPlantilla + '/disponibilidad');
        return req;
    };  
        
    this.post = function (disponibilidad) { 
        var req = $http.post(uri+'/api/disponibilidad',disponibilidad); 
        return req; 
    };
          
    this.put = function (id,disponibilidad) {        
        var req = $http.put(uri+'/api/disponibilidad/' + id, disponibilidad);
        return req;        
    };
        
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/disponibilidad/updateEstado/' + id, object);
        return req;
    };      
    
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/disponibilidades');
        return req;
    };
    
   
}]);




