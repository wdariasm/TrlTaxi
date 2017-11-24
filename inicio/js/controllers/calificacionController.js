function calificacionController($scope, $routeParams, servicioService, toaster ){
    var vm = this;
    
    vm.IdServicio = $routeParams.idServicio;
    vm.Ocultar =  false;
    vm.Servicio = {};
    
    vm.Calificar =  function (){     
        
        if(!vm.Servicio.IdServicio){
            toaster.pop("error", "¡Validación!", "No se puede calificar el servicio. Servicio no asignado.");
            return;
        }
        
        if(vm.Servicio.Estado !== 'FINALIZADO'){
            toaster.pop("error", "¡Validación!", "No se puede calificar el servicio. Servicio no ha finalizado.");
            return;
        }                
        
        if(!vm.Servicio.Calificacion){
            toaster.pop("error", "¡Validación!", "Estimado Cliente, por favor indique la calificación.");
            return;
        }
        if(vm.Servicio.Calificacion <= 0){
            toaster.pop("error", "¡Validación!", "Estimado Cliente, por favor indique la calificación.");
            return;
        }
        
        var promise = servicioService.calificar(vm.Servicio.IdServicio, vm.Servicio);        
        promise.then(function(d) {            
                toaster.pop("success", "¡Información!", d.data.message);
                setTimeout( "location.href = '#/inicio/login'", 5000);
        }, function(err) {           
                toaster.pop('error','¡Error al cargar servicio!',err.data,0);           
                console.log("Some Error Occured " + JSON.stringify(err));
        });         
    };
       
    function getServicio (id){        
        var promise = servicioService.get(id);        
        promise.then(function(d) {  
            if (d.data){
                vm.Servicio = d.data;   
                if (vm.Servicio.Calificacion>0){
                    $('#txtCalificacion').rating('update',  parseInt(vm.Servicio.Calificacion));
                    toaster.pop("info", "¡Información!", "Estimado Cliente, el servicio ya ha sido calificado.");
                    setTimeout( "location.href = '#/inicio/login'", 4000);
                }
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


