function documentoVehiculoCtrl($scope, $rootScope,  vehiculoService, toaster, serverData){
    var vm= this;
    
    vm.Titulo = "Adjuntos";
    vm.Archivo = {};    
    vm.Vehiculo = {};                    
    $rootScope.$on("ImagenVehiculo", function (event, data) {        
        vm.Vehiculo = serverData.data;
        vm.Archivo.Boton = false;
        console.log(serverData.data);
        vm.Titulo =  data +  vm.Vehiculo.Placa;
        
    });
    
    vm.GuardarArchivo =  function (){
                       
        if(!vm.Archivo.dvTipoDoc){
            toaster.pop("info", "¡Validación!", "Estimado Usuario(a), por favor seleccione el tipo de documento.");
            return;
        }
                       
        var formData = new FormData();        
        formData.append('dvNombre', vm.Archivo.dvNombre);
        formData.append('dvTipo', vm.Archivo.dvTipo);
        formData.append('dvSize', vm.Archivo.dvSize);
        formData.append('dvTipoDoc', vm.Archivo.dvTipoDoc);
        formData.append('dvVehiculo', vm.Vehiculo.IdVehiculo);
        formData.append('dvMantenimiento', vm.Vehiculo.IdMantenimiento);        
        formData.append('dvImagen', vm.Archivo.Imagen);        
        
        toaster.pop("wait", "Espere por favor.. ", "Subiendo archivos ");
        vm.Archivo.Boton = true;
        var promise = vehiculoService.postDocumento(formData);                
        promise.then(function(d) {            
            vm.NuevoDocumento();
            toaster.pop('success', "Control de Información", d.data.message);             
        }, function(err) {          
            vm.Archivo.Boton = false;
            toaster.pop('error', "¡Error!", err.data, 0);         
            console.log("Some Error Occured " + JSON.stringify(err));
        }); 
        
    };
    
    vm.NuevoDocumento = function (){
        vm.Archivo.Boton = false;        
        document.getElementById("frmDocumentos").reset();
    };
    
    $scope.SeleccionarArchivo = function () {
        if (typeof window.FileReader !== "undefined") {
            var reader = new FileReader();
            var file = document.getElementById("flArchivoVeh").files[0];
            if (!file) {                
                return;
            }
            vm.Archivo.dvNombre = file.name.split(".")[0];
            vm.Archivo.dvTipo = file.name.split(".")[1];
            vm.Archivo.dvSize =  calcularSize(file.size);
            
            reader.onload = function (e) {                
                $scope.$apply();
            };
            reader.readAsText(file);
        }      
    };
    
    function calcularSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };
    
}

documentoVehiculoCtrl.$inject = ["$scope", "$rootScope", "vehiculoService", "toaster", "serverData"];

app.controller("documentoVehiculoCtrl", documentoVehiculoCtrl);




