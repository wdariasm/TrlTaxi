function calificacionController($scope, $routeParams, servicioService, toaster ){
    var vm = this;
    
    vm.IdServicio = $routeParams.idServicio;
    vm.Servicio = {};
       
    function getServicio (id){        
        var promise = servicioService.get(id);        
        promise.then(function(d) {  
            if (d.data){
                vm.Servicio = d.data;                
            }else{
                toaster.pop("info", "¡Información!", "Servicio no asignado.");
            }
            
        }, function(err) {           
                toaster.pop('error','¡Error al cargar servicio!',err.data,0);           
                console.log("Some Error Occured " + JSON.stringify(err));
        });         
    } 
    
    getServicio(vm.IdServicio);
}

calificacionController.$inject = ["$scope", "$routeParams", "servicioService", "toaster"];

app.controller('calificacionController', calificacionController);


