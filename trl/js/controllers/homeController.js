app.controller("homeController", ["$scope", function ($scope) {
        
    var click = 1;    
        
    $scope.mostrarOcultarMenu = function(){    
        if(click===1){               
            var div  =  document.getElementById("sidebar");
                div.classList.remove('open');   
                
            var div1  =  document.getElementById("contenido");
                div1.classList.remove('contenido-normal');   
                div1.classList.add('contenido-expandido');                
                click += 1;
        } else{
            var div  =  document.getElementById("sidebar");
                div.classList.add('open');   
            
            var div1  =  document.getElementById("contenido");
                div1.classList.remove('contenido-expandido');   
                div1.classList.add('contenido-normal');
            
            click = 1;
        }
    };
}]);
      

