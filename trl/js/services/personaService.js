app.service("personaService", ['$http', function ($http) {

    this.get = function (id) {
        var req = $http.get(uri+'/api/persona/' + id);
        return req;
    };
            
    this.getAll = function () {
        var req = $http.get(uri+'/api/persona');
        return req;
    };   
        
    this.post = function (persona) {
        var req = $http.post(uri+'/api/persona', persona);
        return req;       
    };
    
    this.put = function (id,persona) {        
        var req = $http.put(uri+'/api/persona/' + id, persona);
        return req;        
    };
    
    this.perfil = function () {
        var req = $http.get(uri+'/api/perfil');
        return req;
    };
    
    
    this.updateEstado=function(id, object){
        var req = $http.put(uri+'/api/persona/updateEstado/' + id, object);
        return req;
    };
    
}]);




