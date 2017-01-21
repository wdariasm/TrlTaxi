app.service("conductorService",[ '$http', function ($http) {
    this.get = function (id) {
        var req = $http.get(uri+'/api/conductor/' + id);
        return req;
    };
       
    this.getAll = function () {
        var req = $http.get(uri+'/api/conductor');
        return req;
    };                
        
    this.post = function (conductor) { 
        var req = $http.post(uri+'/api/conductor',conductor); 
        return req; 
    };
    
    this.postImagen = function (formData) {        
        var req = $http.post(uri+'/api/conductor/imagen', formData,{transformRequest: angular.identity, 
            headers: {'Content-Type': undefined}});
        return req;        
    };
          
    this.put = function (id,conductor) {        
        var req = $http.put(uri+'/api/conductor/' + id, conductor);
        return req;        
        
    };
     
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/conductor/updateEstado/' + id, object);
        return req;
    };  
   
    this.getByNombre = function () {
        var req = $http.get(uri+'/api/conductores');
        return req;
    };
    
     this.validarIdentificacion = function(cedula){
        var req = $http.get(uri+'/api/conductor/' + cedula +'/validar');
        return req;	
    };
    
    
    //NOVEDAD
    
    this.postNovedad =function(novedad){
       var req = $http.post(uri+'/api/conductor/novedad' ,novedad);
        return req;  
    };
        
    this.putNovedad = function (id,novedad) {        
        var req = $http.put(uri+'/api/conductor/novedad/' + id, novedad);
        return req;        
    };
 
    this.getNovedad = function (id){
        var req = $http.get(uri+'/api/conductor/'+ id + '/novedades' );
        return req;
    };
    
    
    //LICENCIAS 
     this.postLicencia =function(licencia){
       var req = $http.post(uri+'/api/conductor/licenciaConduccion' ,licencia);
        return req;  
    };
        
    this.putLicencia = function (id,licencia) {        
        var req = $http.put(uri+'/api/conductor/licenciaConduccion/' + id, licencia);
        return req;        
    };
     this.getLicencia = function (Id){
        var req = $http.get(uri+'/api/conductor/'+ Id + '/licencias' );
        return req;
    };
    
    this.validarNumero = function(Numero){
        var req = $http.get(uri+'/api/licenciaConduccion/' + Numero +'/validar');
        return req;	
    };
    
     this.updateEstadoLicencia=function(id, object){
        var req = $http.put(uri+'/api/licenciaConduccion/updateEstado/' + id, object);
        return req;
    };  
    
}]);


